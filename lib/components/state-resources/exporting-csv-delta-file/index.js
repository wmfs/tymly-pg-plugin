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

function loadFunctions (env, name) {
  if (!name) return

  const names = Array.isArray(name) ? name.filter(n => n) : [name]
  return names.map(n => getFunction(env, n))
} // loadFunctions

class ExportingCsvDeltaFile {
  init (resourceConfig, env) {
    this.client = env.bootedServices.storage.client
    this.statebox = env.bootedServices.statebox

    this.actionAliases = resourceConfig.actionAliases
    this.createdColumnName = resourceConfig.createdColumnName || '_created'
    this.modifiedColumnName = resourceConfig.modifiedColumnName || '_modified'
    this.csvExtracts = resourceConfig.csvExtracts

    this.transformFunction = loadFunctions(env, resourceConfig.transformerFunctionName)
    this.filterFunction = loadFunctions(env, resourceConfig.filterFunctionName)
    this.deletesFunction = loadFunction(env, resourceConfig.deletesFunctionName)

    this.progressFunction = loadFunction(env, resourceConfig.progressFunctionName)

    this.env = env
  }

  async run (event, context) {
    try {
      const progressFunction = this.makeProgressFunction(event, context)

      const info = await generateDelta(
        {
          namespace: context.stateMachineMeta.namespace,
          client: this.client,
          since: event.lastExportDate,
          outputFilepath: event.outputFilepath,
          actionAliases: this.actionAliases,
          transformFunction: this.transformFunction,
          filterFunction: this.filterFunction,
          deletesFunction: this.deletesFunction,
          progressCallback: progressFunction,
          createdColumnName: this.createdColumnName,
          modifiedColumnName: this.modifiedColumnName,
          csvExtracts: this.csvExtracts,
          dryrun: event.dryrun,
          headerData: event.headerData
        }
      )

      context.sendTaskSuccess({
        outputRowCount: info.totalCount,
        info: info
      })

      if (progressFunction) {
        // sometimes the heartbeats and complete don't settle
        // in the order they're raised, so wait a moment and
        // then complete again, just to be sure
        await delay()
        progressFunction(info, true)
      }
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

    const parentExecutionName = event.parentExecutionName
    const executionOptions = cloneDeep(context.executionOptions)
    const formatter = this.makeProgressFormatter(event)

    const pFn = this.progressFunction
      ? this.progressFunction
      : () => {}

    return (info, complete) => {
      const updateEvent = complete ? 'sendTaskLastHeartbeat' : 'sendTaskHeartbeat'
      const formattedInfo = formatter(info, complete)

      this.statebox[updateEvent](
        parentExecutionName,
        formattedInfo,
        executionOptions
      )
        .catch(() => {})
        // ignore failures, but don't let them
        // propagate so we don't bring down the
        // whole state machine

      pFn(info, complete)
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
      if (complete) formatted.complete = complete

      const shaped = { }
      dottie.set(shaped, event.parentResultPath, formatted)
      return shaped
    }
  } // makeProgressFormatter
} // class ExportingCsvDeltaFile

function delay () {
  return new Promise(resolve => setTimeout(resolve, 100))
}

module.exports = ExportingCsvDeltaFile
