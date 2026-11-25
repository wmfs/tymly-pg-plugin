'use strict'

const _ = require('lodash')
const schema = require('./schema.json')
const process = require('process')

const relationize = require('@wmfs/relationize')
const pgInfo = require('@wmfs/pg-info')
const pgDiffSync = require('@wmfs/pg-diff-sync')
const pgModel = require('@wmfs/pg-model')

const HlPgClient = require('@wmfs/hl-pg-client')

const generateUpsertStatement = require('./generate-upsert-statement')

// The year is worked out by Postgres, in the sequence's timezone (parameter $2), so every Tymly
// instance agrees on when the year turns over.
const YEAR_SQL = 'extract(year from (now() at time zone $2))::integer'
const DEFAULT_YEARLY_SEQUENCE_TIMEZONE = 'Europe/London'
const YEARLY_SEQUENCE_LOCK = 'tymly.yearly_sequence'
const yearlySequenceTimezone = definition => definition.timezone || DEFAULT_YEARLY_SEQUENCE_TIMEZONE

class PostgresqlStorageService {
  async boot (options) {
    this.logger = options.bootedServices.logger.child('service:storage')
    this.storageName = 'postgresql'

    const connectionString = PostgresqlStorageService._connectionString(options.config, this.logger)
    infoMessage(options.messages, `Using PostgresqlStorage... (${connectionString})`)

    this.client = new HlPgClient(connectionString)

    this.models = {}
    this.sequences = {}
    this.schemaNames = []
    this.jsonSchemas = []

    this._pushModelSchemas(options.blueprintComponents.models || {})

    await this._installExtension()
    await this._createModels(options.messages)
    await this._insertMultipleSeedData(options.blueprintComponents.seedData, options.messages)
    await this._generateSequences(options.blueprintComponents.sequences, options.messages)
  } // boot

  async shutdown () {
    await this.client.end()
  }

  static _connectionString (config, logger) {
    if (config.pgConnectionString) {
      logger.debug('Using config.pgConnectionString')
      return config.pgConnectionString
    }

    logger.debug('Using PG_CONNECTION_STRING environment variable')
    return process.env.PG_CONNECTION_STRING
  } // _connectionUrl

  _pushModelSchemas (modelDefinitions) {
    Object.values(modelDefinitions).forEach(
      modelDefinition => this._pushModelSchema(modelDefinition)
    )
  } // _pushModelSchemas

  _pushModelSchema (modelDefinition) {
    const schemaName = _.kebabCase(modelDefinition.namespace).replace(/-/g, '_')
    if (!this.schemaNames.includes(schemaName)) {
      this.schemaNames.push(schemaName)
    }

    this.jsonSchemas.push({
      namespace: modelDefinition.namespace,
      schema: modelDefinition
    })
  } // _pushModelSchema

  _installExtension () {
    return this.client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
  }

  async _generateSequences (sequences, messages) {
    infoMessage(messages, 'Loading sequences:')
    for (const [id, value] of Object.entries(sequences || {})) {
      if (value.startWith) {
        detailMessage(messages, id)
        const sqlId = `${_.snakeCase(value.namespace)}.${_.snakeCase(value.id)}`
        const key = `${value.namespace}_${value.id}`
        this.sequences[key] = value

        if (value.resetsYearly === true) {
          await this._initYearlySequence(key, sqlId, value, messages)
        } else {
          await this.client.query(`CREATE SEQUENCE IF NOT EXISTS ${sqlId} START WITH ${value.startWith};`)
        }
      }
    }
  }

  // Yearly sequences
  //
  // A sequence with "resetsYearly": true restarts at startWith every calendar year.
  // Instead of resetting a Postgres sequence on New Year's Day (which can be missed, and races
  // if several Tymly instances run), values are held per (sequence, year) in tymly.yearly_sequence,
  // where value is the last value issued that year. The first value issued in a new year creates
  // that year's row, so nothing needs to run at midnight. The year and value are returned together,
  // so a human-readable ID can never mix last year's year with this year's number.
  //
  // The Postgres sequence is still created; it is only read once, on first boot, to carry its
  // position over into the current year.
  async _initYearlySequence (key, sqlId, definition, messages) {
    // Everything happens in one transaction, holding an advisory lock, so Tymly instances booting
    // together can't both decide the sequence is new and set up its rows twice.
    await this.client.run([{
      sql: `-- initialise yearly sequence ${key}`,
      params: [],
      action: async (sql, params, tx) => {
        await tx.query('SELECT pg_advisory_xact_lock(hashtext($1));', [YEARLY_SEQUENCE_LOCK])
        await tx.query('CREATE SCHEMA IF NOT EXISTS tymly;')
        await tx.query(`
          CREATE TABLE IF NOT EXISTS tymly.yearly_sequence (
            id text NOT NULL,
            year integer NOT NULL,
            value bigint NOT NULL,
            _created timestamp with time zone NOT NULL DEFAULT now(),
            _modified timestamp with time zone NOT NULL DEFAULT now(),
            PRIMARY KEY (id, year)
          );`)

        const { rows: [{ existed }] } = await tx.query('SELECT to_regclass($1) IS NOT NULL AS existed;', [sqlId])
        await tx.query(`CREATE SEQUENCE IF NOT EXISTS ${sqlId} START WITH ${definition.startWith};`)

        // The Postgres sequence anchors the counter's lifetime: if it had to be created (its schema was
        // dropped, as test suites do), yearly values left behind start again too - as the old sequence
        // would have. In production this means something has gone wrong, so say so loudly.
        if (!existed) {
          const { rowCount } = await tx.query('DELETE FROM tymly.yearly_sequence WHERE id = $1;', [key])
          if (rowCount > 0) {
            const warning = `Sequence ${sqlId} was missing and has been recreated, so the yearly numbering ` +
              `held for ${key} in tymly.yearly_sequence (${rowCount} year(s)) has been cleared and will restart at ${definition.startWith}`
            this.logger.warn(warning)
            if (messages && messages.warning) messages.warning(warning)
          }
        }

        // First boot after resetsYearly is switched on: carry the Postgres sequence's position over into
        // the current year. This assumes the sequence has only issued values for the current year so far;
        // if it hasn't been reset, this year continues from its total instead of restarting.
        await tx.query(`
          INSERT INTO tymly.yearly_sequence (id, year, value)
          SELECT $1, ${YEAR_SQL}, CASE WHEN s.is_called THEN s.last_value ELSE s.last_value - 1 END
          FROM ${sqlId} s
          WHERE NOT EXISTS (SELECT 1 FROM tymly.yearly_sequence WHERE id = $1);`,
        [key, yearlySequenceTimezone(definition)]
        )
      }
    }])
  }

  async nextYearlySequenceValue (id) {
    const definition = this.sequences[id]
    const { rows } = await this.client.query(`
      INSERT INTO tymly.yearly_sequence (id, year, value)
      VALUES ($1, ${YEAR_SQL}, $3)
      ON CONFLICT (id, year) DO UPDATE SET value = tymly.yearly_sequence.value + 1, _modified = now()
      RETURNING value, year;`,
    [id, yearlySequenceTimezone(definition), definition.startWith]
    )
    return { value: String(rows[0].value), year: rows[0].year }
  }

  // The last value issued this year, or startWith - 1 if none has been yet
  async currentYearlySequenceValue (id) {
    const definition = this.sequences[id]
    const { rows } = await this.client.query(`
      SELECT y.year, s.value
      FROM (SELECT ${YEAR_SQL} AS year) y
      LEFT JOIN tymly.yearly_sequence s ON s.id = $1 AND s.year = y.year;`,
    [id, yearlySequenceTimezone(definition)]
    )
    const { year, value } = rows[0]
    return { value: String(value === null ? definition.startWith - 1 : value), year }
  }

  // Restarts this year's numbering at startWith. The row is kept (rather than deleted) so the first-boot
  // carry-over can never run again and overwrite it.
  async resetYearlySequence (id) {
    const definition = this.sequences[id]
    await this.client.query(`
      INSERT INTO tymly.yearly_sequence (id, year, value)
      VALUES ($1, ${YEAR_SQL}, $3)
      ON CONFLICT (id, year) DO UPDATE SET value = EXCLUDED.value, _modified = now();`,
    [id, yearlySequenceTimezone(definition), definition.startWith - 1]
    )
  }

  async _createModels (messages) {
    if (!this.schemaNames.length || !this.jsonSchemas.length) {
      infoMessage(messages, 'No models to create')
      return
    }

    infoMessage(messages, `Getting info for from DB schemas: ${this.schemaNames.join(', ')}...`)
    const { currentDbStructure, expectedDbStructure } = await fetchDatabaseSchemas(
      this.client,
      this.schemaNames,
      this.jsonSchemas,
      messages
    )

    const createStatements = generateCreateStatements(currentDbStructure, expectedDbStructure)
    const updateStatements = generateUpdateStatements(currentDbStructure, expectedDbStructure)

    if (createStatements.length) {
      infoMessage(messages, 'Creating new database objects')
      await this.client.run(createStatements)
    }

    if (updateStatements.length) {
      infoMessage(messages, 'Altering existing database objects')
      try {
        this.client.run(updateStatements)
      } catch (err) {
        messages.warning(err.message)
      }
    }

    const models = pgModel({
      client: this.client,
      dbStructure: expectedDbStructure,
      service: this
    })

    infoMessage(messages, 'Models:')
    for (const [namespaceId, namespace] of Object.entries(models)) {
      for (const [modelId, model] of Object.entries(namespace)) {
        const id = `${namespaceId}_${modelId}`
        if (!this.models[id]) {
          detailMessage(messages, id)
          this.models[id] = model
        } // if ...
      } // for ...
    } // for ...
  } // _createModels

  async addModel (name, definition, messages) {
    if (!name || !definition) {
      return
    }

    if (this.models[name]) {
      detailMessage(messages, `${name} already defined in PostgresqlStorage ...`)
      return this.models[name]
    }

    detailMessage(messages, `Adding ${name} to PostgresqlStorage`)
    this._pushModelSchema(definition)
    await this._createModels(messages)
    return this.models[name]
  } // addModel

  async _insertMultipleSeedData (seedDataArray, messages) {
    if (!seedDataArray) {
      infoMessage(messages, 'No seed data to insert')
      return
    }

    infoMessage(messages, 'Loading seed data:')

    for (const seedData of Object.values(seedDataArray)) {
      const name = `${seedData.namespace}_${seedData.name}`
      const model = this.models[name]
      if (model) {
        await this._insertModelSeedData(name, model, seedData, messages)
      } else {
        detailMessage(messages, `WARNING: seed data found for model ${name}, but no such model was found`)
      }
    } // for ...
  } // _insertMultipleSeedData

  _insertModelSeedData (name, model, seedData, messages) {
    detailMessage(messages, name)

    // generate upsert sql statement
    const sql = generateUpsertStatement(model, seedData)
    this.logger.debug('load', name, 'seed-data sql: ', sql)

    // generate a single array of parameters which each
    // correspond with a placeholder in the upsert sql statement
    const params = []
    seedData.data.forEach(row => params.push(...row))
    this.logger.debug('load', name, 'seed-data params: ', params)

    return this.client.run(
      [{
        sql,
        params
      }]
    )
  } // _insertModelSeedData

  /// ////////
  currentUser () {
    if (!this.user) {
      return null
    }
    if (typeof this.user === 'function') {
      return this.user()
    }
    return this.user
  } // currentUser

  setCurrentUser (user) {
    this.user = user
  }

  checkSequenceExists (id) {
    if (this.sequences[id] === undefined || this.sequences[id] === null) {
      return false
    }
    return this.sequences[id]
  }

  get createdByField () { return '_created_by' }
  get modifiedByField () { return '_modified_by' }
  get modifiedField () { return '_modified' }
} // PostgresqlStorageService

async function fetchDatabaseSchemas (client, schemaNames, jsonSchemas, messages) {
  const currentDbStructure = await pgInfo({
    client,
    schemas: schemaNames
  })

  const expectedDbStructure = await relationize({
    source: {
      schemas: jsonSchemas
    }
  })

  return {
    currentDbStructure,
    expectedDbStructure
  }
} // fetchDatabaseSchemas

function generateCreateStatements (currentDbStructure, expectedDbStructure) {
  return generateStatements(
    currentDbStructure,
    expectedDbStructure,
    { includeChanges: false }
  )
} // generateCreateStatements

function generateUpdateStatements (currentDbStructure, expectedDbStructure) {
  return generateStatements(
    currentDbStructure,
    expectedDbStructure,
    { includeCreates: false }
  )
} // generateUpdateStatements

function generateStatements (currentDbStructure, expectedDbStructure, options) {
  return pgDiffSync(
    currentDbStructure,
    expectedDbStructure,
    options
  ).map(statementTransform)
} // generateStatements

function statementTransform (statement) {
  return {
    sql: statement,
    params: []
  }
}

function detailMessage (messages, msg) {
  if (!messages) {
    return
  }

  messages.detail(msg)
} // detailMessage

function infoMessage (messages, msg) {
  if (!messages) {
    return
  }

  messages.info(msg)
} // infoMessage

module.exports = {
  schema,
  serviceClass: PostgresqlStorageService,
  refProperties: {
    modelId: 'models'
  }
}
