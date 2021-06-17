const pg = require('pg')
const { snakeCase } = require('lodash')

const TYMLY_NOTIFICATION = 'TYMLY_NOTIFICATION'
const EVENTS = [
  'beforeInsert',
  'afterInsert',
  'beforeUpdate',
  'afterUpdate',
  'beforeDelete',
  'afterDelete'
]

class ListenerService {
  async boot (options) {
    const { websocketServer } = options.bootedServices
    const models = options.blueprintComponents.models

    const connectionString = process.env.PG_CONNECTION_STRING
    // todo: what if we want to listen to multiple? such as warehouse?
    // todo: maybe use PG_LISTEN_... and collect them?

    const listener = new pg.Client({ connectionString })
    listener.connect()

    options.messages.info('Adding PG model listeners')

    for (const k of Object.keys(models)) {
      const model = models[k]

      if (model.listeners) {
        const eventTriggers = [...new Set(model.listeners.filter(l => EVENTS.includes(l)))]

        for (const event of eventTriggers) {
          options.messages.detail(`${k} - ${event}`)

          const modelName = k.split('_')[1]
          const schema = snakeCase(model.namespace)
          const id = `${snakeCase(modelName)}_${snakeCase(event)}`
          const key = `${schema}_${modelName}_${event}`

          const sql = [
            `CREATE OR REPLACE FUNCTION ${schema}.${id}()`,
            `RETURNS trigger AS`,
            '$BODY$',
            'BEGIN',
            `PERFORM pg_notify('${TYMLY_NOTIFICATION}', to_jsonb('{ "key": "${key}", "record": ' || to_jsonb(NEW)::text || ' }')::text);`,
            'RETURN NEW;',
            'END;',
            '$BODY$',
            'LANGUAGE plpgsql;',
            `DROP TRIGGER IF EXISTS ${id}_trigger on ${schema}.${snakeCase(modelName)};`,
            `CREATE TRIGGER ${id}_trigger`,
            `${snakeCase(event).replace(/_/g, ' ').toUpperCase()} ON ${schema}.${snakeCase(modelName)}`,
            `FOR EACH ROW EXECUTE PROCEDURE ${schema}.${id}();`
          ]

          await listener.query(sql.join('\n'))
        }
      }
    }

    listener.query(`LISTEN "${TYMLY_NOTIFICATION}"`)

    listener.on('notification', msg => {
      const payload = JSON.parse(msg.payload)
      websocketServer.send(payload)
    })
  }
}

module.exports = {
  schema: require('./schema.json'),
  serviceClass: ListenerService,
  bootAfter: ['storage', 'statebox']
}