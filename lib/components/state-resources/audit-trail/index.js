const _ = require('lodash')
const DateTime = require('luxon').DateTime

class AuditTrail {
  init (resourceConfig, env, callback) {
    this.auditLog = env.bootedServices.storage.models['tymly_rewind']
    this.models = env.blueprintComponents.models

    callback(null)
  } // init

  async run (event, context) {
    const model = event.model
    const key = Object.values(event.keys).join('_')

    const auditLogs = await this.auditLog.find({
      where: {
        modelName: { equals: model },
        keyString: { equals: key }
      }
    })

    const format = logFormat(event)

    const logs = formatLogs(
      format,
      auditLogs,
      this.models[model.replace('.', '_')]
    )

    context.sendTaskSuccess(logs)
  } // run
} // class AuditTrail

function logFormat (event) {
  return event.format || 'readable'
} // logFormat

function formatLogs (format, rawLogs, model) {
  if (format === 'raw') {
    return rawLogs
  }

  const logs = rawLogs
    .map(l => formatLog(l, model))
    .reverse()
  return logs
} // formattedLogs

function formatLog (log, model) {
  const diffs = formatDiffs(log.diff, model)
  const when = formatDate(log.modified)

  const formatted = {
    change: diffs.join(', \n'),
    modified: when,
    modifiedBy: log.modifiedBy
  }
  return formatted
} // formatLog

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
  return `${label} changed from "${change.from}" to "${change.to}"`
} // formatDiff

function formatDate (jsDate) {
  const d = DateTime.fromJSDate(jsDate)
  return `${d.toLocaleString(DateTime.TIME_24_SIMPLE)} ${d.toLocaleString(DateTime.DATE_MED)}`
} // formatDate

module.exports = AuditTrail
