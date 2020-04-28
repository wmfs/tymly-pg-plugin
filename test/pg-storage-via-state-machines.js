/* eslint-env mocha */

'use strict'

const expect = require('chai').expect
const tymly = require('@wmfs/tymly')
const path = require('path')
const sqlScriptRunner = require('./fixtures/sql-script-runner')
const process = require('process')
const STATE_MACHINE_NAME = 'tymlyTest_people_1_0'

describe('PG storage service via state machine tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService
  let registryService
  let categoryService
  let client
  let statebox
  let executionName
  let models

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
          path.resolve(__dirname, './fixtures/blueprints/people-blueprint'),
          path.resolve(__dirname, './fixtures/blueprints/space-blueprint'),
          path.resolve(__dirname, './fixtures/blueprints/seed-data-blueprint')
        ],

        config: {}
      }
    )

    tymlyService = tymlyServices.tymly
    client = tymlyServices.storage.client
    statebox = tymlyServices.statebox
    registryService = tymlyServices.registry
    categoryService = tymlyServices.categories
    models = tymlyServices.storage.models
  })

  it('drop-cascade the pg_model_test schema, if one exists', async () => {
    await sqlScriptRunner.install(client)
  })

  it('find the simple-storage state-machine', () => {
    const stateMachine = statebox.findStateMachineByName(STATE_MACHINE_NAME)
    expect(stateMachine.name).to.eql(STATE_MACHINE_NAME)
  })

  it('run simple-storage execution', async () => {
    const executionDescription = await statebox.startExecution(
      {
        employeeNo: 1,
        firstName: 'Homer',
        lastName: 'Simpson',
        age: 39
      }, // input
      STATE_MACHINE_NAME, // state machine name
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.status).to.eql('SUCCEEDED')
    expect(executionDescription.stateMachineName).to.eql(STATE_MACHINE_NAME)
    expect(executionDescription.currentStateName).to.eql('FindingById')
    expect(executionDescription.ctx.foundHomer.employeeNo).to.eql('1')
    expect(executionDescription.ctx.foundHomer.firstName).to.eql('Homer')
    expect(executionDescription.ctx.foundHomer.lastName).to.eql('Simpson')
    expect(executionDescription.ctx.foundHomer.age).to.eql(39)
  })

  it('run simple-storage execution again', async () => {
    const executionDescription = await statebox.startExecution(
      {
        employeeNo: 50,
        firstName: 'Seymour',
        lastName: 'Skinner',
        age: 48
      },
      STATE_MACHINE_NAME,
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.status).to.eql('SUCCEEDED')
  })

  it('run simple-storage execution with bad data (extra fields)', async () => {
    const executionDescription = await statebox.startExecution(
      {
        skinner: {
          employeeNo: 50,
          firstName: 'Seymour',
          lastName: 'Skinner',
          age: 42,
          job: ''
        }
      },
      'tymlyTest_badpeople_1_0',
      {}
    )

    executionName = executionDescription.executionName
  })

  it('state "SUCCEEDED" on "bad data" because extra fields are ok', async () => {
    const executionDescription =
      await statebox.waitUntilStoppedRunning(executionName)

    expect(executionDescription.status).to.eql('SUCCEEDED')
  })

  it('start simple-storage execution with bad data (missing fields)', async () => {
    const executionDescription = await statebox.startExecution(
      {
        skinner: {
          employeeNo: 50,
          firstName: 'Seymour'
        }
      },
      'tymlyTest_badpeople_1_0',
      {}
    )

    executionName = executionDescription.executionName
  })

  it('state "FAILED" on "bad data" due to missing rows', async () => {
    const executionDescription =
      await statebox.waitUntilStoppedRunning(executionName)

    expect(executionDescription).to.not.eql(null)
    expect(executionDescription.status).to.eql('FAILED')
  })

  it('start simple-storage execution with "bad data" (missing PK)', async () => {
    const executionDescription = await statebox.startExecution(
      {
        skinner: {
          firstName: 'Seymour',
          lastName: 'Skinner',
          age: 43
        }
      },
      'tymlyTest_badpeople_1_0',
      {}
    )

    executionName = executionDescription.executionName
  })

  it('state "FAILED" on "bad data" due to missing PK', async () => {
    const executionDescription =
      await statebox.waitUntilStoppedRunning(executionName)

    expect(executionDescription).to.not.eql(null)
    expect(executionDescription.status).to.eql('FAILED')
  })

  it('verify registry service (which has JSONB columns)', () => {
    expect(registryService.registry.tymlyTest_planetSizeUnit.value).to.eql('km')
  })

  it('verify categories service (which has JSONB columns)', () => {
    expect(Object.keys(categoryService.categories).includes('gas')).to.eql(true)
    expect(Object.keys(categoryService.categories).includes('terrestrial')).to.eql(true)
    expect(categoryService.categories.gas).to.eql({
      category: 'gas',
      label: 'Gas',
      styling: {
        'background-color': '#80C342'
      }
    })
    expect(categoryService.categories.terrestrial).to.eql({
      category: 'terrestrial',
      label: 'terrestrial',
      styling: {
        'background-color': '#5F5F5F '
      }
    })
  })

  it('verify seed-data into the db (which has a JSONB column)', async () => {
    const result = await models.tymlyTest_title.find({ where: { title: { equals: 'Miss' } } })

    expect(result[0]).to.have.property('id').and.equal('3')
    expect(result[0]).to.have.property('title').and.equal('Miss')
    expect(result[0]).to.have.property('style')
    expect(result[0].style).to.have.property('backgroundColor').and.equal('#ffffff')
  })

  it('find the seed-data state-machine by name', () => {
    const stateMachine = statebox.findStateMachineByName('tymlyTest_seedDataTest_1_0')
    expect(stateMachine.name).to.eql('tymlyTest_seedDataTest_1_0')
  })

  it('start seed-data execution', async () => {
    const executionDescription = await statebox.startExecution(
      {
        idToFind: 3
      }, // input
      'tymlyTest_seedDataTest_1_0', // state machine name
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.ctx.foundTitle.title).to.eql('Miss')
    expect(executionDescription.currentStateName).to.eql('FindingById')
    expect(executionDescription.currentResource).to.eql('module:findingById')
    expect(executionDescription.stateMachineName).to.eql('tymlyTest_seedDataTest_1_0')
    expect(executionDescription.status).to.eql('SUCCEEDED')
  })

  after('uninstall test schemas', async () => {
    await sqlScriptRunner.uninstall(client)
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
