/**
 * Created by Aron.Moore on 12/07/2017.
 */
'use strict'
const generateDelta = require('@wmfs/pg-delta-file')
const getFunction = require('@wmfs/tymly/lib/getFunction.js')

function loadFunction (env, name) {
  return name
    ? getFunction(env, name)
    : null
} // loadFunction

class ExportingCsvDeltaFile {
  init (resourceConfig, env) {
    this.client = env.bootedServices.storage.client
    this.actionAliases = resourceConfig.actionAliases
    this.createdColumnName = resourceConfig.createdColumnName || '_created'
    this.modifiedColumnName = resourceConfig.modifiedColumnName || '_modified'
    this.csvExtracts = resourceConfig.csvExtracts
    this.transformFunction = loadFunction(env, resourceConfig.transformerFunctionName)
    this.filterFunction = loadFunction(env, resourceConfig.filterFunctionName)
  }

  async run (event, context) {
    try {
      const info = await generateDelta(
        {
          namespace: context.stateMachineMeta.namespace,
          client: this.client,
          since: event.lastExportDate,
          outputFilepath: event.outputFilepath,
          actionAliases: this.actionAliases,
          transformFunction: this.transformFunction,
          filterFunction: this.filterFunction,
          createdColumnName: this.createdColumnName,
          modifiedColumnName: this.modifiedColumnName,
          csvExtracts: this.csvExtracts
        }
      )

      context.sendTaskSuccess({
        outputRowCount: info.totalCount
      })
    } catch (err) {
      context.sendTaskFailure({
        error: 'generateDeltaFail',
        cause: err
      })
    } // catch
  } // run
} // class ExportingCsvDeltaFile

module.exports = ExportingCsvDeltaFile
