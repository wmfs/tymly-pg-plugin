const pg = require('pg')
const { snakeCase } = require('lodash')
const debug = require('debug')('pg-listener')

const TYMLY_NOTIFICATION = 'TYMLY_NOTIFICATION'

const WHEN_TRIGGERS = {
  insert: 'AFTER INSERT',
  update: 'BEFORE UPDATE',
  delete: 'BEFORE DELETE'
}

class ListenerService {
  async boot (options) {
    const { websocketServer, statebox } = options.bootedServices
    const { models, modelHooks } = options.blueprintComponents

    const connectionString = process.env.PG_CONNECTION_STRING

    const listener = new pg.Client({ connectionString })
    listener.connect()

    this.statebox = statebox
    this.loadedListeners = {}

    await this.installListeners(options, listener, models)
    this.installHooks(options, modelHooks)

    listener.query(`LISTEN "${TYMLY_NOTIFICATION}"`)

    listener.on('notification', msg => {
      debug('notify', msg.payload)
      const payload = JSON.parse(msg.payload)
      const { key } = JSON.parse(payload)

      const actions = this.loadedListeners[key]
        ? this.loadedListeners[key].map(({ type, config = {} }) => this.hookAction(type, config, JSON.parse(payload)))
        : []

      console.log('>>', actions)

      websocketServer.broadcast(payload)
    })
  }

  hookAction (type, config, payload) {
    if (type === 'stateMachine') {
      const { stateMachineName, input = {} } = config
      debug(`Executing state machine ${stateMachineName} with input ${JSON.stringify(input)}`)
      // todo: pass payload with input
      return this.statebox.startExecution(
        input,
        stateMachineName,
        { sendResponse: 'COMPLETE' }
      )
    } else {
      debug(`Unknown action type: ${type} with config ${JSON.stringify(config)}`)
    }
  } // hookAction

  async installListeners (options, listener, models) {
    options.messages.info('Adding PG model listeners')

    for (const k of Object.keys(models)) {
      const model = models[k]

      if (model.listeners) {
        const whenTriggers = [...new Set(model.listeners.filter(l => Object.keys(WHEN_TRIGGERS).includes(l)))]

        for (const when of whenTriggers) {
          options.messages.detail(`${k} - ${when}`)

          if (!this.loadedListeners[`${k}_${when}`]) this.loadedListeners[`${k}_${when}`] = []

          const modelName = k.split('_')[1]
          const namespace = snakeCase(model.namespace)
          const id = `${snakeCase(modelName)}_${when}`
          const key = `${namespace}_${modelName}_${when}`

          const functionName = `${namespace}.${id}`
          const triggerName = `${id}_trigger`

          const sql = [
            `DROP FUNCTION IF EXISTS ${functionName}() CASCADE;`,
            'CREATE FUNCTION ' + functionName + '()',
            'RETURNS trigger AS',
            '$BODY$',
            'BEGIN',
            `PERFORM pg_notify('${TYMLY_NOTIFICATION}', to_jsonb('{ "key": "${key}", "record": ' || to_jsonb(${when === 'delete' ? 'OLD' : 'NEW'})::text || ' }')::text);`,
            `RETURN ${when === 'delete' ? 'OLD' : 'NEW'};`,
            'END;',
            '$BODY$',
            'LANGUAGE plpgsql;',
            `DROP TRIGGER IF EXISTS ${triggerName} on ${namespace}.${snakeCase(modelName)};`,
            `CREATE TRIGGER ${triggerName}`,
            `${WHEN_TRIGGERS[when]} ON ${namespace}.${snakeCase(modelName)}`,
            `FOR EACH ROW EXECUTE PROCEDURE ${functionName}();`
          ]

          await listener.query(sql.join('\n'))
        }
      }
    }
  } // installListeners

  installHooks (options, modelHooks) {
    options.messages.info('Adding PG model hooks')

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

module.exports = {
  schema: require('./schema.json'),
  serviceClass: ListenerService,
  bootAfter: ['storage', 'statebox', 'websocketServer']
}
