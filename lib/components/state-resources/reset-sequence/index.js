const _ = require('lodash')

class ResetSequence {
  init (resourceConfig, env) {
    this.id = `${_.snakeCase(resourceConfig.namespace)}.${_.snakeCase(resourceConfig.id)}`
    this.client = env.bootedServices.storage.client
    this.sequences = env.bootedServices.storage.sequences
  }

  async run (event, context) {
    if (this.sequences[this.id] === null || this.sequences[this.id] === undefined) {
      context.sendTaskFailure({
        error: 'SEQUENCE_NOT_FOUND',
        cause: `The sequence "${this.id}" was not found. Please ensure the sequence exists.`
      })
    }

    await this.client.query(`ALTER SEQUENCE ${this.id} RESTART WITH 1;`)
    context.sendTaskSuccess()
  }
}

module.exports = ResetSequence
