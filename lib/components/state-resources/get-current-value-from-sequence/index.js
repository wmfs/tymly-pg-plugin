const _ = require('lodash')

class GetCurrentValueFromSequence {
  init (resourceConfig, env) {
    this.sqlId = `${_.snakeCase(resourceConfig.namespace)}.${_.snakeCase(resourceConfig.id)}`
    this.id = `${resourceConfig.namespace}_${resourceConfig.id}`
    this.prefix = resourceConfig.prefix || ''
    this.client = env.bootedServices.storage.client
    this.storage = env.bootedServices.storage
  }

  async run (event, context) {
    const seq = await this.storage.checkSequenceExists(this.id)
    if (!seq) {
      return context.sendTaskFailure({
        error: 'SEQUENCE_NOT_FOUND',
        cause: `Sequence ${this.id} was not found. Ensure it exists before attempting to manipulate`
      })
    }

    const value = await this.client.query(`SELECT last_value FROM ${this.sqlId}`)
    return context.sendTaskSuccess({ value: `${this.prefix}${value.rows[0].last_value}` })
  }
}

module.exports = GetCurrentValueFromSequence
