/* eslint-env mocha */

'use strict'

const expect = require('chai').expect
const tymly = require('@wmfs/tymly')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const process = require('process')
const chai = require('chai')
const chaiSubset = require('chai-subset')
chai.use(chaiSubset)
const sqlScriptRunner = require('./fixtures/sql-script-runner')
const OUTPUT_DIR_PATH = path.resolve(__dirname, './output')

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

describe('Import and Synchronize State Resources', function () {
  this.timeout(process.env.TIMEOUT || 5000)
  const IMPORT_STATE_MACHINE_NAME = 'tymlyTest_importCsv_1_0'
  const SYNC_STATE_MACHINE_NAME = 'tymlyTest_syncAnimal_1_0'
  let client, tymlyService, statebox

  before(function () {
    if (process.env.PG_CONNECTION_STRING && !/^postgres:\/\/[^:]+:[^@]+@(?:localhost|127\.0\.0\.1).*$/.test(process.env.PG_CONNECTION_STRING)) {
      console.log(`Skipping tests due to unsafe PG_CONNECTION_STRING value (${process.env.PG_CONNECTION_STRING})`)
      this.skip()
    }
  })

  it('boot Tymly', async () => {
    const tymlyServices = await tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, './../lib')
        ],
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/animal-blueprint'),
          path.resolve(__dirname, './fixtures/blueprints/sequence-blueprint')
        ],
        config: {}
      }
    )

    tymlyService = tymlyServices.tymly
    client = tymlyServices.storage.client
    statebox = tymlyServices.statebox
  })

  it('execute importingCsvFiles', async () => {
    const executionDescription = await statebox.startExecution(
      {
        sourceDir: path.resolve(__dirname, './fixtures/input')
      },
      IMPORT_STATE_MACHINE_NAME,
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.status).to.eql('SUCCEEDED')
    expect(executionDescription.currentStateName).to.equal('ImportingCsvFiles')
  })

  it('verify the animals have been added', async () => {
    const result = await client.query(
      'select * from tymly_test.animal_with_age'
    )

    expect(result.rows[0].animal).to.eql('cat')
    expect(result.rows[1].animal).to.eql('dog')
    expect(result.rows[2].animal).to.eql('mouse')

    expect(result.rows[0].colour).to.eql('black')
    expect(result.rows[1].colour).to.eql('brown')
    expect(result.rows[2].colour).to.eql('grey')

    expect(result.rows[0].age).to.eql(2)
    expect(result.rows[1].age).to.eql(6)
    expect(result.rows[2].age).to.eql(3)
  })

  it('execute synchronizingTable', async () => {
    const executionDescription = await statebox.startExecution(
      {
        outputDir: OUTPUT_DIR_PATH
      },
      SYNC_STATE_MACHINE_NAME,
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.status).to.eql('SUCCEEDED')
    expect(executionDescription.currentStateName).to.equal('SynchronizingTable')
  })

  it('verify the animals have been added and converted', async () => {
    const result = await client.query(
      'select * from tymly_test.animal_with_year'
    )

    expect(result.rows.length).to.eql(3)
    for (const res of result.rows) {
      switch (res.animal) {
        case 'dog':
          expect(res.colour).to.eql('brown')
          expect(res.year_born).to.eql(2011)
          break
        case 'cat':
          expect(res.colour).to.eql('black')
          expect(res.year_born).to.eql(2015)
          break
        case 'mouse':
          expect(res.colour).to.eql('grey')
          expect(res.year_born).to.eql(2014)
          break
      }
    }
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
    sqlScriptRunner.uninstall(client)
  })

  after('should remove output directory now tests are complete', () => {
    if (fs.existsSync(OUTPUT_DIR_PATH)) {
      rimraf.sync(OUTPUT_DIR_PATH, {})
    }
  })

  after('should shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
