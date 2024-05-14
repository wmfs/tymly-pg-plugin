const _ = require('lodash')

class GetCurrentValueFromSequence {
  init (resourceConfig, env) {
    this.id = `${_.snakeCase(resourceConfig.namespace)}.${_.snakeCase(resourceConfig.id)}`
    this.prefix = resourceConfig.prefix || ''
    this.client = env.bootedServices.storage.client
    this.sequences = env.bootedServices.storage.sequences
  }

  async run (event, context) {
    if (this.sequences[this.id] === null || this.sequences[this.id] === undefined) {
      context.sendTaskFailure({
        error: 'SEQUENCE_NOT_FOUND',
        message: `The sequence "${this.id}" was not found. Please ensure the sequence exists.`
      })
    }
    const value = await this.client.query(`SELECT last_value FROM ${this.id}`)
    context.sendTaskSuccess({ value: `${this.prefix}${value.rows[0].last_value}` })
  }
}

module.exports = GetCurrentValueFromSequence
