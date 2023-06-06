const Readable = 'readable'

class AuditTrail {
  init (resourceConfig, env) {
    this.services = env.bootedServices
  } // init

  get audit () { return this.services.audit }

  async run (event, context) {
    const model = event.model

    const auditLogs = await this.audit.loadLogs(
      model,
      event.keys
    )

    const format = logFormat(event)

    const logs = (format === Readable)
      ? this.audit.formatLogs(model, auditLogs)
      : auditLogs

    context.sendTaskSuccess(logs)
  } // run
} // class AuditTrail

function logFormat (event) {
  return event.format || Readable
} // logFormat

module.exports = AuditTrail
