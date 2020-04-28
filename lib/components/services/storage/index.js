'use strict'

const debug = require('debug')('@wmfs/tymly-pg-plugin')

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
  boot (options, callback) {
    this.storageName = 'postgresql'

    const connectionString = PostgresqlStorageService._connectionString(options.config)
    infoMessage(options.messages, `Using PostgresqlStorage... (${connectionString})`)

    this.client = new HlPgClient(connectionString)

    this.models = {}
    this.schemaNames = []
    this.jsonSchemas = []

    this._pushModelSchemas(options.blueprintComponents.models || {})

    this._installExtension()
      .then(() => this._createModels(options.messages))
      .then(() => this._insertMultipleSeedData(options.blueprintComponents.seedData, options.messages))
      .then(() => this._runScripts(options.blueprintComponents.pgScripts, options.messages))
      .then(() => this._generateSequences(options.blueprintComponents.sequences, options.messages))
      .then(() => callback())
      .catch(err => callback(err))
  } // boot

  async shutdown () {
    await this.client.end()
  }

  static _connectionString (config) {
    if (config.pgConnectionString) {
      debug('Using config.pgConnectionString')
      return config.pgConnectionString
    }

    debug('Using PG_CONNECTION_STRING environment variable')
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

  async _installExtension () {
    return this.client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
  }

  async _generateSequences (sequences, messages) {
    infoMessage(messages, 'Loading sequences:')
    for (const [id, value] of Object.entries(sequences || {})) {
      if (value.startWith) {
        detailMessage(messages, id)
        const sql = `CREATE SEQUENCE IF NOT EXISTS ${_.snakeCase(value.namespace)}.${_.snakeCase(value.id)} START WITH ${value.startWith};`
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
      const name = seedData.namespace + '_' + seedData.name
      const model = this.models[name]
      if (model) {
        detailMessage(messages, name)

        // generate upsert sql statement
        const sql = generateUpsertStatement(model, seedData)
        debug('load', name, 'seed-data sql: ', sql)

        // generate a single array of parameters which each
        // correspond with a placeholder in the upsert sql statement
        let params = []
        _.forEach(seedData.data, (row) => {
          params = params.concat(row)
        })
        debug('load', name, 'seed-data params: ', params)

        await this.client.run(
          [{
            sql: sql,
            params: params
          }]
        )
      } else {
        detailMessage(messages, `WARNING: seed data found for model ${name}, but no such model was found`)
      }
    } // for ...
  } // _doInsertMultipleSeedData

  _runScripts (scripts, messages) {
    infoMessage(messages, 'Scripts:')
    if (!scripts) return detailMessage(messages, 'No scripts found')

    const scriptInstallers = Object.keys(scripts).map(script => {
      detailMessage(messages, script)
      return this.client.runFile(scripts[script].filePath)
    })

    return Promise.all(scriptInstallers)
  } // _runScripts

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

  get createdByField () { return '_created_by' }
  get modifiedByField () { return '_modified_by' }
} // PostgresqlStorageService

async function fetchDatabaseSchemas (client, schemaNames, jsonSchemas, messages) {
  const currentDbStructure = await pgInfo({
    client: client,
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
  schema: schema,
  serviceClass: PostgresqlStorageService,
  refProperties: {
    modelId: 'models'
  }
}
