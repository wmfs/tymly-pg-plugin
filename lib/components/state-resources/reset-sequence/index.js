const _ = require('lodash')

class ResetSequence {
  init (resourceConfig, env) {
    this.id = `${_.snakeCase(resourceConfig.namespace)}.${_.snakeCase(resourceConfig.id)}`
    this.client = env.bootedServices.storage.client
  }

  async run (event, context) {
    await this.client.query(`ALTER SEQUENCE ${this.id} RESTART WITH 1;`)
    context.sendTaskSuccess()
  }
}

module.exports = ResetSequence
