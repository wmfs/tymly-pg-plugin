/* eslint-env mocha */

const tymly = require('@wmfs/tymly')
const path = require('path')
const chai = require('chai')
const chaiSubset = require('chai-subset')
const sqlScriptRunner = require('./fixtures/sql-script-runner')
chai.use(chaiSubset)
const expect = chai.expect

describe('Sequence State Resources', function () {
  this.timeout(process.env.TIMEOUT || 5000)
  let tymlyService, client, statebox

  before(function () {
    if (process.env.PG_CONNECTION_STRING && !/^postgres:\/\/[^:]+:[^@]+@(?:localhost|127\.0\.0\.1).*$/.test(process.env.PG_CONNECTION_STRING)) {
      console.log(`Skipping tests due to unsafe PG_CONNECTION_STRING value (${process.env.PG_CONNECTION_STRING})`)
      this.skip()
    }
  })

  before('create some tymly services', async () => {
    const tymlyServices = await tymly.boot(
      {
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/sequence-blueprint')
        ],
        pluginPaths: [
          path.resolve(__dirname, './../lib')
        ],
        config: {}
      }
    )

    tymlyService = tymlyServices.tymly
    client = tymlyServices.storage.client
    statebox = tymlyServices.statebox
  })

  it('find current sequence value of 1', async () => {
    const executionDescription = await statebox.startExecution(
      {},
      'tymlyTest_findCurrentSequenceValue_1_0',
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.ctx).to.containSubset({
      ticketId: '1'
    })
  })

  it('find next sequence value of 1', async () => {
    const executionDescription = await statebox.startExecution(
      {},
      'tymlyTest_findNextSequenceValue_1_0',
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.ctx).to.containSubset({
      ticketId: '1'
    })
  })

  it('find next sequence value of 2', async () => {
    const executionDescription = await statebox.startExecution(
      {},
      'tymlyTest_findNextSequenceValue_1_0',
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.ctx).to.containSubset({
      ticketId: '2'
    })
  })

  it('find (prefixed) current sequence value of ABC2', async () => {
    const executionDescription = await statebox.startExecution(
      {},
      'tymlyTest_findCurrentSequenceValueWithPrefix_1_0',
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.ctx).to.containSubset({
      ticketId: 'ABC2'
    })
  })

  it('find (prefixed) next sequence value of XYZ3', async () => {
    const executionDescription = await statebox.startExecution(
      {},
      'tymlyTest_findNextSequenceValueWithPrefix_1_0',
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.ctx).to.containSubset({
      ticketId: 'XYZ3'
    })
  })

  after('uninstall test schemas', async () => {
    await sqlScriptRunner.uninstall(client)
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
