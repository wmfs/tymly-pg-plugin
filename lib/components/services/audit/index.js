'use strict'

const _ = require('lodash')
const path = require('path')
const schema = require('./schema.json')
const generateTriggerStatement = require('./generate-trigger-statement')
const pgInfo = require('@wmfs/pg-info')
const DateTime = require('luxon').DateTime

class AuditService {
  async boot (options) {
    this.logger = options.bootedServices.logger.child('service:audit')
    this.models = options.blueprintComponents.models || {}
    this.client = options.bootedServices.storage.client
    this.auditLog = options.bootedServices.storage.models.tymly_rewind

    const pgScripts = options.blueprintComponents.pgScripts || {}
    const auditFunctions = gatherAuditFunctions(pgScripts, this.logger)
    const schemaNames = options.bootedServices.storage.schemaNames

    await this.updateTriggers(auditFunctions, schemaNames, options.messages)
  } // boot

  async updateTriggers (auditFunctions, schemaNames, messages) {
    const currentDbStructure = await pgInfo({
      client: this.client,
      schemas: schemaNames
    })

    for (const func of auditFunctions) {
      messages.info(`Applying ${func.name} function`)
      const installers = Object.keys(this.models)
        .map(model => this.installTrigger(func, model, currentDbStructure, messages))
        .filter(p => !!p)

      if (installers.length) {
        await Promise.all(installers)
      } else {
        messages.detail('Already in place')
      }
    }
  } // updateTriggers

  installTrigger (func, model, currentDbStructure, messages) {
    const audit = this.models[model].audit !== false

    const namespace = _.snakeCase(this.models[model].namespace)
    const name = _.snakeCase(this.models[model].name)
    const triggerName = `${namespace}_${name}_auditor${func.triggerSuffix}`

    const modelTriggers = currentDbStructure.schemas[namespace].tables[name].triggers

    const hasTrigger = Object.keys(modelTriggers).includes(triggerName)
    const action = (!hasTrigger && audit) ? 'ADD' : ((hasTrigger && !audit) ? 'REMOVE' : '')
    this.logger.debug(`Model: ${model}, Wants to audit: ${audit}, Already has trigger: ${hasTrigger}, Action: ${action}`)

    const triggerSQL = generateTriggerStatement(
      this.models[model],
      triggerName,
      func,
      action
    )

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

  loadLogs (model, keyObject) {
    const keyString = Object.values(keyObject).join('_')

    // model will be in format of: tymly.favoriteStateMachines
    // but model name is saved in format of: tymly.favorite_state_machines
    const [namespace, modelId] = model.split('.')
    const modelName = [namespace, _.snakeCase(modelId)].join('.')

    return this.auditLog.find({
      where: {
        modelName: { equals: modelName },
        keyString: { equals: keyString }
      },
      orderBy: ['modified']
    })
  } // loadLoads

  formatLogs (modelName, auditLogs, additionalFields = []) {
    const model = this.models[modelName.replace('.', '_')]

    const logs = auditLogs
      .map(l => formatLog(l, model, additionalFields))
      .reverse()
    return logs
  } // formatLogs
} // AuditService

function gatherAuditFunctions (pgScripts, logger) {
  return Object.keys(pgScripts)
    .map(script => path.parse(pgScripts[script].filename).name)
    .filter(filename => filename.split('-')[0] === 'audit')
    .map(filename => {
      const functionName = filename.substring(filename.indexOf('-') + 1)
      logger.debug(`Found audit function: ${functionName}`)
      return auditFunctionProperties(functionName)
    })
} // gatherAuditFunctions

const whenTrigger = {
  insert: 'AFTER INSERT',
  update: 'BEFORE UPDATE',
  delete: 'BEFORE DELETE'
}

const triggerSuffix = {
  insert: '_insert',
  update: '',
  delete: '_delete'
}

function auditFunctionProperties (functionName) {
  const type = functionName.split('-')[0]

  return {
    name: functionName,
    triggerSuffix: triggerSuffix[type],
    when: whenTrigger[type]
  }
} // auditFunctionProperties

function formatLog (log, model, additionalFields) {
  const action = (typeof log.diff.action === 'string')

  const diffs = action ? formatAction(log.diff.action, log.oldValues, model) : formatDiffs(log.diff, model)
  const when = formatDate(log.modified)

  const formatted = {
    change: diffs.join(', \n'),
    modified: when,
    modifiedBy: log.modifiedBy
  }

  additionalFields.forEach(f => { formatted[f] = log[f] })

  return formatted
} // fomatLog

function formatAction (action, record, model) {
  const actionText = _.capitalize(action)
  if (!model.label) return [actionText]

  const labelFields = Array.isArray(model.label) ? model.label : [model.label]
  return labelFields.map((field, index) => {
    const label = record[field]
    return (index === 0) ? `${actionText} ${label}` : label
  }).filter(l => l)
}

function formatDiffs (diffs, model) {
  return Object.entries(diffs)
    .map(([field, change]) => formatDiff(field, change, model))
    .filter(l => l)
} // formatDiffs

function formatDiff (field, change, model) {
  const propertyName = _.camelCase(field)
  const property = model.properties[propertyName]

  if (!property || property.audit === 'raw') {
    return
  }

  const label = property.title || field

  if (!change.from) {
    return `${label} set to "${change.to}"`
  }
  if (!change.to) {
    return `${label} "${change.from}" was cleared`
  }

  return `${label} changed from "${change.from}" to "${change.to}"`
} // formatDiff

function formatDate (jsDate) {
  if (!jsDate) return undefined
  const d = DateTime.fromJSDate(jsDate)
  return `${d.toLocaleString(DateTime.TIME_24_SIMPLE)} ${d.toLocaleString(DateTime.DATE_MED)}`
} // formatDate

module.exports = {
  schema: schema,
  serviceClass: AuditService,
  bootAfter: ['storage', 'statebox']
}
