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
        const sql = `CREATE SEQUENCE IF NOT EXISTS ${_.snakeCase(value.namespace)}.${_.snakeCase(value.id)} START WITH ${value.startWith};`
        this.sequences[`${value.namespace}_${value.id}`] = value
        await this.client.query(sql)
      }
    }
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
