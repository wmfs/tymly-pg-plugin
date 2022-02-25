const pg = require('pg')
const { snakeCase } = require('lodash')

const TYMLY_NOTIFICATION = 'TYMLY_NOTIFICATION'

const WHEN_TRIGGERS = {
  beforeInsert: 'BEFORE INSERT',
  afterInsert: 'AFTER INSERT',

  beforeUpdate: 'BEFORE UPDATE',
  afterUpdate: 'AFTER UPDATE',

  beforeDelete: 'BEFORE DELETE',
  afterDelete: 'AFTER DELETE'
}

class ListenerService {
  async boot (options) {
    this.logger = options.bootedServices.logger.child('service:listener')
    this.statebox = options.bootedServices.statebox
    this.websocket = options.bootedServices.websocket
    this.storageModels = options.bootedServices.storage.models

    this.loadedListeners = {}

    const connectionString = process.env.PG_CONNECTION_STRING

    const listener = new pg.Client({ connectionString })
    listener.connect()

    await this.installListeners(options, listener, options.blueprintComponents.models)
    this.installHooks(options, options.blueprintComponents.modelHooks)

    listener.query(`LISTEN "${TYMLY_NOTIFICATION}"`)
    listener.on('notification', msg => this.handleNotification(msg))
  }

  handleNotification (msg) {
    this.logger.debug(`received notification - ${msg.payload}`)

    try {
      const { key, record } = extractFromPayload(msg.payload, this.storageModels)

      const actions = this.loadedListeners[key]
        ? this.loadedListeners[key].map(({
            type,
            config = {}
          }) => this.hookAction(type, config, record))
        : []

      Promise.all(actions)
        .then(() => this.websocket.broadcast({ key, record }))
        .catch(err => console.log(`ERROR ${err}`))
    } catch (err) {
      this.logger.error('something went wrong')
    }
  }

  hookAction (type, config, payload) {
    if (type === 'stateMachine') {
      const { stateMachineName, input = {} } = config
      this.logger.debug(`Executing state machine ${stateMachineName} with input ${JSON.stringify(input)}`)

      return this.statebox.startExecution(
        { payload, ...input },
        stateMachineName,
        { sendResponse: 'COMPLETE' } // todo: userId ?
      )
    } else {
      this.logger.warn(`Unknown action type: ${type} with config ${JSON.stringify(config)}`)
    }
  } // hookAction

  async installListeners (options, listener, models) {
    options.messages.info('Adding PG model listeners')

    for (const [fullModelId, model] of Object.entries(models)) {
      if (!Array.isArray(model.listeners)) continue

      const whenTriggers = ensureValidTriggers(model.listeners)

      for (const when of whenTriggers) {
        const fullListenerId = [fullModelId, when].join('_')

        options.messages.detail(fullListenerId)

        if (!this.loadedListeners[fullListenerId]) this.loadedListeners[fullListenerId] = []

        const [, modelId] = fullModelId.split('_')
        const namespace = snakeCase(model.namespace)
        const id = [modelId, when].map(snakeCase).join('_')
        const functionName = `${namespace}.${id}`
        const triggerName = `${id}_trigger`

        const sql = [
          createFunctionSql({ functionName, when, fullListenerId }),
          createTriggerSql({ functionName, when, triggerName, namespace, modelId })
        ].join(' ')

        await listener.query(sql)
      }
    }
  } // installListeners

  installHooks (options, modelHooks) {
    options.messages.info('Adding PG model hooks')

    if (!modelHooks) return

    for (const [hook, { listener, actions }] of Object.entries(modelHooks)) {
      options.messages.detail(hook)

      if (this.loadedListeners[listener]) {
        this.loadedListeners[listener].push(...actions)
      } else {
        console.log(`Cannot find listener: '${listener}'`)
      }
    }
  } // installHooks
} // ListenerService

function listenerIdToModelId (fullListenerId) {
  try {
    const [namespace, modelId] = fullListenerId.split('_')
    return [namespace, modelId].join('_')
  } catch (err) { }
}

function extractFromPayload (payload, models) {
  if (typeof payload !== 'string') return payload

  const payloadObj = JSON.parse(payload)
  const { key, record } = JSON.parse(payloadObj)

  const fullModelId = listenerIdToModelId(key)
  if (!fullModelId) return { key, record }

  const model = models[fullModelId]
  if (!model) return { key, record }

  return {
    key,
    record: Object.entries(record).reduce((acc, [column, value]) => {
      const property = model.columnToPropertyId[column]
      acc[property || column] = value
      return acc
    }, {})
  }
}

function ensureValidTriggers (listeners) {
  return [...new Set(listeners.filter(l => Object.keys(WHEN_TRIGGERS).includes(l)))]
}

function createFunctionSql ({ functionName, fullListenerId, when }) {
  const toDelete = when === 'beforeDelete' || when === 'afterDelete'

  return [
    `DROP FUNCTION IF EXISTS ${functionName}() CASCADE;`,
    'CREATE FUNCTION ' + functionName + '()',
    'RETURNS trigger AS',
    '$BODY$',
    'BEGIN',
    `PERFORM pg_notify('${TYMLY_NOTIFICATION}', to_jsonb('{ "key": "${fullListenerId}", "record": ' || to_jsonb(${toDelete ? 'OLD' : 'NEW'})::text || ' }')::text);`,
    `RETURN ${toDelete ? 'OLD' : 'NEW'};`,
    'END;',
    '$BODY$',
    'LANGUAGE plpgsql;'
  ].join('\n')
}

function createTriggerSql ({ triggerName, namespace, modelId, when, functionName }) {
  return [
    `DROP TRIGGER IF EXISTS ${triggerName} on ${namespace}.${snakeCase(modelId)};`,
    `CREATE TRIGGER ${triggerName}`,
    `${WHEN_TRIGGERS[when]} ON ${namespace}.${snakeCase(modelId)}`,
    `FOR EACH ROW EXECUTE PROCEDURE ${functionName}();`
  ].join('\n')
}

module.exports = {
  schema: require('./schema.json'),
  serviceClass: ListenerService,
  bootAfter: ['storage', 'statebox', 'websocket']
}
