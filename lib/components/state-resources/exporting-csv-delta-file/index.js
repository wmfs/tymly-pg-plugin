/**
 * Created by Aron.Moore on 12/07/2017.
 */
const dottie = require('dottie')
const cloneDeep = require('lodash').cloneDeep
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
    this.statebox = env.bootedServices.statebox

    this.actionAliases = resourceConfig.actionAliases
    this.createdColumnName = resourceConfig.createdColumnName || '_created'
    this.modifiedColumnName = resourceConfig.modifiedColumnName || '_modified'
    this.csvExtracts = resourceConfig.csvExtracts

    this.transformFunction = loadFunction(env, resourceConfig.transformerFunctionName)
    this.filterFunction = loadFunction(env, resourceConfig.filterFunctionName)
    this.progressFunction = loadFunction(env, resourceConfig.progressFunctionName)

    this.env = env
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
          progressCallback: this.makeProgressFunction(event, context),
          createdColumnName: this.createdColumnName,
          modifiedColumnName: this.modifiedColumnName,
          csvExtracts: this.csvExtracts,
          dryrun: event.dryrun
        }
      )

      context.sendTaskSuccess({
        outputRowCount: info.totalCount,
        info: info
      })
    } catch (err) {
      context.sendTaskFailure({
        error: 'generateDeltaFail',
        cause: err
      })
    } // catch
  } // run

  makeProgressFunction (event, context) {
    if (!event.parentExecutionName) {
      return this.progressFunction
    }

    const executionOptions = cloneDeep(context.executionOptions)
    const formatter = this.makeProgressFormatter(event)

    const pFn = this.progressFunction
      ? this.progressFunction
      : () => {}

    return (info, complete) => {
      try {
        const updateEvent = complete ? 'sendTaskSuccess' : 'sendTaskHeartbeat'
        const formattedInfo = formatter(info, complete)

        this.statebox[updateEvent](
          event.parentExecutionName,
          formattedInfo,
          executionOptions
        )

        pFn(info, complete)
      } catch (e) {
        // ignore failures, but don't let them
        // propagate so we don't bring down the
        // whole state machine
      }
    }
  } // makeProgressFunction

  makeProgressFormatter (event) {
    const formatter = event.parentCallbackFormatter
      ? loadFunction(this.env, event.parentCallbackFormatter)
      : i => i

    if (!event.parentResultPath) {
      return formatter
    }

    return (info, complete) => {
      const formatted = formatter(cloneDeep(info))
      formatted.complete = complete

      const shaped = { }
      dottie.set(shaped, event.parentResultPath, formatted)
      return shaped
    }
  } // makeProgressFormatter
} // class ExportingCsvDeltaFile

module.exports = ExportingCsvDeltaFile
