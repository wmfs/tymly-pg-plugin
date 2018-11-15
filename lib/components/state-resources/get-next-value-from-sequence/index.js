const _ = require('lodash')

class GetNextValueFromSequence {
  init (resourceConfig, env, callback) {
    this.id = `${_.snakeCase(resourceConfig.namespace)}.${_.snakeCase(resourceConfig.id)}`
    this.client = env.bootedServices.storage.client
    callback(null)
  }

  async run (event, context) {
    const value = await this.client.query(`select nextval('${this.id}')`)
    context.sendTaskSuccess({ value: value.rows[0].nextval })
  }
}

module.exports = GetNextValueFromSequence
