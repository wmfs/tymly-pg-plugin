/**
 * Created by Aron.Moore on 12/07/2017.
 */
'use strict'
const startTelepods = require('@wmfs/pg-telepods')
const getFunction = require('@wmfs/tymly/lib/getFunction.js')

class SynchronizingTable {
  init (resourceConfig, env) {
    this.client = env.bootedServices.storage.client
    this.source = resourceConfig.source
    this.target = resourceConfig.target
    this.join = resourceConfig.join
    this.transformFunction = getFunction(
      env,
      resourceConfig.transformerFunctionName
    )
  }

  run (event, context) {
    startTelepods({
      client: this.client,
      outputDir: event,
      source: this.source,
      target: this.target,
      join: this.join,
      transformFunction: this.transformFunction
    })
      .then(() => context.sendTaskSuccess())
      .catch(err => context.sendTaskFailure({
        error: 'startTelepodsFail',
        cause: err
      }))
  } // run
}

module.exports = SynchronizingTable
