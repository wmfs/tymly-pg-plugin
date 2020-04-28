/* eslint-env mocha */

'use strict'

const chai = require('chai')
const tymly = require('@wmfs/tymly')
const expect = chai.expect
const path = require('path')
const sqlScriptRunner = require('./fixtures/sql-script-runner')
const process = require('process')

describe('Multicopy state-resource tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)
  let client
  let tymlyService
  let statebox
  const STATE_MACHINE_NAME = 'foodTest_food_1_0'
  let executionName

  before(function () {
    if (process.env.PG_CONNECTION_STRING && !/^postgres:\/\/[^:]+:[^@]+@(?:localhost|127\.0\.0\.1).*$/.test(process.env.PG_CONNECTION_STRING)) {
      console.log(`Skipping tests due to unsafe PG_CONNECTION_STRING value (${process.env.PG_CONNECTION_STRING})`)
      this.skip()
    }
  })

  it('boot tymly', async () => {
    const tymlyServices = await tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, './../lib')
        ],

        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/food-blueprint')
        ],

        config: {}
      }
    )

    tymlyService = tymlyServices.tymly
    client = tymlyServices.storage.client
    statebox = tymlyServices.statebox
  })

  it('start multicopy execution', async () => {
    const executionDescription = await statebox.startExecution(
      {
        sourceDir: path.resolve(__dirname, 'fixtures', 'food-data')
      }, // input
      STATE_MACHINE_NAME, // state machine name
      {}
    )

    executionName = executionDescription.executionName
  })

  it('complete multicopy execution', async () => {
    const executionDescription = await statebox.waitUntilStoppedRunning(executionName)

    expect(executionDescription.status).to.eql('SUCCEEDED')
    expect(executionDescription.stateMachineName).to.eql(STATE_MACHINE_NAME)
    expect(executionDescription.currentStateName).to.eql('ImportingCsvFiles')
  })

  it('verify data in "meat" table', async () => {
    const result = await client.query('select * from food_test.meat')

    expect(result.rows[0].food_name).to.eql('steak')
    expect(result.rows[1].food_name).to.eql('kebab')
    expect(result.rows[2].food_name).to.eql('chicken')

    expect(result.rows[0].food_group).to.eql('red meat')
    expect(result.rows[1].food_group).to.eql('red meat')
    expect(result.rows[2].food_group).to.eql('white meat')
  })

  it('verify data in "veg" table', async () => {
    const result = await client.query('select * from food_test.veg')

    expect(result.rows[0].food_name).to.eql('peas')
    expect(result.rows[1].food_name).to.eql('carrot')
    expect(result.rows[2].food_name).to.eql('potato')

    expect(result.rows[0].food_group).to.eql('legumes')
    expect(result.rows[1].food_group).to.eql('root')
    expect(result.rows[2].food_group).to.eql('root')
  })

  after('clean up DB env', async () => {
    await sqlScriptRunner.cleanup(client)
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
