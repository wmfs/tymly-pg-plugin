const _ = require('lodash')

class GetCurrentValueFromSequence {
  init (resourceConfig, env) {
    this.id = `${_.snakeCase(resourceConfig.namespace)}.${_.snakeCase(resourceConfig.id)}`
    this.prefix = resourceConfig.prefix || null
    this.client = env.bootedServices.storage.client
  }

  async run (event, context) {
    const value = await this.client.query(`SELECT last_value FROM ${this.id}`)
    context.sendTaskSuccess({ value: (this.prefix ? `${this.prefix}${value.rows[0].last_value}` : value.rows[0].last_value) })
  }
}

module.exports = GetCurrentValueFromSequence
