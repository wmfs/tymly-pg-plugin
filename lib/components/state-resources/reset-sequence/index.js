const _ = require('lodash')

class ResetSequence {
  init (resourceConfig, env) {
    this.sqlId = `${_.snakeCase(resourceConfig.namespace)}.${_.snakeCase(resourceConfig.id)}`
    this.id = `${resourceConfig.namespace}_${resourceConfig.id}`
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

    await this.client.query(`ALTER SEQUENCE ${this.sqlId} RESTART WITH 1;`)
    return context.sendTaskSuccess()
  }
}

module.exports = ResetSequence
