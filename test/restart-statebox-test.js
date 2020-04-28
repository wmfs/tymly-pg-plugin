/* eslint-env mocha */

const path = require('path')
const expect = require('chai').expect
const process = require('process')
const STATE_MACHINE_NAME = 'tymlyTest_aDayInTheLife'

describe('Restart statebox test - cat state machine', function () {
  const tymly = require('@wmfs/tymly')
  let tymlyService
  let statebox
  this.timeout(process.env.TIMEOUT || 5000)
  let rupert

  const tymlyConfig = {
    blueprintPaths: [
      path.resolve(__dirname, './restart-fixtures/blueprints/cats-blueprint')
    ],

    pluginPaths: [
      path.resolve(__dirname, './../lib'),
      path.resolve(__dirname, './restart-fixtures/plugins/cats-plugin')
    ]
  }

  before(function () {
    if (process.env.PG_CONNECTION_STRING && !/^postgres:\/\/[^:]+:[^@]+@(?:localhost|127\.0\.0\.1).*$/.test(process.env.PG_CONNECTION_STRING)) {
      console.log(`Skipping tests due to unsafe PG_CONNECTION_STRING value (${process.env.PG_CONNECTION_STRING})`)
      this.skip()
    }
  })

  it('boot tymly', async () => {
    const tymlyServices = await tymly.boot(
      tymlyConfig
    )

    tymlyService = tymlyServices.tymly
    statebox = tymlyServices.statebox
  })

  it('find cat state machine', () => {
    const stateMachine = statebox.findStateMachineByName(STATE_MACHINE_NAME)
    expect(stateMachine.name).to.eql(STATE_MACHINE_NAME)
  })

  it('execute cat state machine', async () => {
    const executionDescription = await statebox.startExecution(
      {
        petName: 'Rupert',
        gender: 'male',
        hoursSinceLastMotion: 11,
        hoursSinceLastMeal: 5,
        petDiary: []
      }, // input
      STATE_MACHINE_NAME, // state machine name
      {} // options
    )

    rupert = executionDescription.executionName
  })

  xit('reboot tymly', async () => {
    const tymlyServices = await tymly.boot(
      tymlyConfig
    )
    statebox = tymlyServices.statebox
  })

  it('complete Rupert\'s day', async () => {
    const executionDescription =
      await statebox.waitUntilStoppedRunning(rupert)

    expect(executionDescription.status).to.eql('SUCCEEDED')
    expect(executionDescription.stateMachineName).to.eql('tymlyTest_aDayInTheLife')
    expect(executionDescription.currentStateName).to.eql('Sleeping')
    expect(executionDescription.ctx.hoursSinceLastMeal).to.eql(0)
    expect(executionDescription.ctx.hoursSinceLastMotion).to.eql(0)
    expect(executionDescription.ctx.gender).to.eql('male')
    expect(executionDescription.ctx.petDiary).to.be.an('array')
    expect(executionDescription.ctx.petDiary[0]).to.equal('Look out, Rupert is waking up!')
    expect(executionDescription.ctx.petDiary[2]).to.equal("Rupert is walking... where's he off to?")
    expect(executionDescription.ctx.petDiary[6]).to.equal('Shh, Rupert is eating...')
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
