/* eslint-env mocha */

'use strict'

const expect = require('chai').expect
const tymly = require('@wmfs/tymly')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const process = require('process')
const sqlScriptRunner = require('./fixtures/sql-script-runner')
const OUTPUT_DIR_PATH = path.resolve(__dirname, './output')

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

describe('State Resource Tests', function () {
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

  it('should boot Tymly', function (done) {
    tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, './../lib')
        ],

        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/animal-blueprint')
        ],

        config: {}
      },
      function (err, tymlyServices) {
        expect(err).to.eql(null)
        tymlyService = tymlyServices.tymly
        client = tymlyServices.storage.client
        statebox = tymlyServices.statebox
        done()
      }
    )
  })

  it('should execute importingCsvFiles', function (done) {
    statebox.startExecution(
      {
        sourceDir: path.resolve(__dirname, './fixtures/input')
      },
      IMPORT_STATE_MACHINE_NAME,
      {
        sendResponse: 'COMPLETE'
      },
      function (err, executionDescription) {
        expect(err).to.eql(null)
        expect(executionDescription.status).to.eql('SUCCEEDED')
        expect(executionDescription.currentStateName).to.equal('ImportingCsvFiles')
        done()
      }
    )
  })

  it('should check the animals have been added', function (done) {
    client.query(
      'select * from tymly_test.animal_with_age',
      function (err, result) {
        if (err) {
          done(err)
        } else {
          expect(result.rows[0].animal).to.eql('cat')
          expect(result.rows[1].animal).to.eql('dog')
          expect(result.rows[2].animal).to.eql('mouse')

          expect(result.rows[0].colour).to.eql('black')
          expect(result.rows[1].colour).to.eql('brown')
          expect(result.rows[2].colour).to.eql('grey')

          expect(result.rows[0].age).to.eql(2)
          expect(result.rows[1].age).to.eql(6)
          expect(result.rows[2].age).to.eql(3)
          done()
        }
      }
    )
  })

  it('should execute synchronizingTable', function (done) {
    statebox.startExecution(
      {
        outputDir: OUTPUT_DIR_PATH
      },
      SYNC_STATE_MACHINE_NAME,
      {
        sendResponse: 'COMPLETE'
      },
      function (err, executionDescription) {
        expect(err).to.eql(null)
        expect(executionDescription.status).to.eql('SUCCEEDED')
        expect(executionDescription.currentStateName).to.equal('SynchronizingTable')
        done()
      }
    )
  })

  it('should check the animals have been added and converted', function (done) {
    client.query(
      'select * from tymly_test.animal_with_year',
      function (err, result) {
        if (err) {
          done(err)
        } else {
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
          done()
        }
      }
    )
  })

  it('should uninstall test schemas', async () => {
    sqlScriptRunner.uninstall(client)
  })

  it('should remove output directory now tests are complete', function (done) {
    if (fs.existsSync(OUTPUT_DIR_PATH)) {
      rimraf(OUTPUT_DIR_PATH, {}, done)
    } else {
      done()
    }
  })

  it('should shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})