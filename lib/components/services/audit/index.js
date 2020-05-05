'use strict'

const _ = require('lodash')
const path = require('path')
const schema = require('./schema.json')
const generateTriggerStatement = require('./generate-trigger-statement')
const debug = require('debug')('@wmfs/tymly-pg-plugin')
const pgInfo = require('@wmfs/pg-info')

class AuditService {
  async boot (options) {
    this.models = options.blueprintComponents.models || {}
    this.client = options.bootedServices.storage.client
    this.schemaNames = options.bootedServices.storage.schemaNames

    const pgScripts = options.blueprintComponents.pgScripts || {}
    this.auditFunctions = Object.keys(pgScripts)
      .map(script => path.parse(pgScripts[script].filename).name)
      .filter(filename => filename.split('-')[0] === 'audit')
      .map(filename => {
        debug(`Found audit function: ${filename.substring(filename.indexOf('-') + 1)}`)
        return filename.substring(filename.indexOf('-') + 1)
      })

    await this.updateTriggers(options.messages)
  } // boot

  async updateTriggers (messages) {
    const currentDbStructure = await pgInfo({
      client: this.client,
      schemas: this.schemaNames
    })

    const allInstallers = this.auditFunctions
      .map(func => {
        messages.info(`Applying ${func} function`)
        const installers = Object.keys(this.models)
          .map(model => this.installTrigger(func, model, currentDbStructure, messages))
          .filter(p => !!p)

        if (installers.length === 0) {
          messages.detail('Already in place')
          return
        }
        return Promise.all(installers)
      })

    return Promise.all(allInstallers)
  } // updateTriggers

  installTrigger (func, model, currentDbStructure, messages) {
    const audit = this.models[model].audit !== false

    const namespace = _.snakeCase(this.models[model].namespace)
    const name = _.snakeCase(this.models[model].name)
    const triggerName = `${namespace}_${name}_auditor`

    const modelTriggers = currentDbStructure.schemas[namespace].tables[name].triggers

    const hasTrigger = Object.keys(modelTriggers).includes(triggerName)
    const action = (!hasTrigger && audit) ? 'ADD' : ((hasTrigger && !audit) ? 'REMOVE' : '')
    debug(`Model: ${model}, Wants to audit: ${audit}, Already has trigger: ${hasTrigger}, Action: ${action}`)

    const triggerSQL = generateTriggerStatement({
      model: this.models[model],
      function: func,
      action: action
    })

    if (!triggerSQL) {
      return null
    }

    messages.detail(
      action === 'ADD'
        ? `Adding trigger to ${model}`
        : `Removing trigger from ${model}`
    )
    return this.client.query(triggerSQL)
  } // installTrigger
}

module.exports = {
  schema: schema,
  serviceClass: AuditService,
  bootAfter: ['storage', 'statebox']
}
