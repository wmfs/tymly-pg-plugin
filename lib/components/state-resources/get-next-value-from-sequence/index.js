const _ = require('lodash')

class GetNextValueFromSequence {
  init (resourceConfig, env) {
    this.id = `${_.snakeCase(resourceConfig.namespace)}.${_.snakeCase(resourceConfig.id)}`
    this.prefix = resourceConfig.prefix || ''
    this.client = env.bootedServices.storage.client
  }

  async run (event, context) {
    const value = await this.client.query(`select nextval('${this.id}')`)
    context.sendTaskSuccess({ value: `${this.prefix}${value.rows[0].nextval}` })
  }
}

module.exports = GetNextValueFromSequence
