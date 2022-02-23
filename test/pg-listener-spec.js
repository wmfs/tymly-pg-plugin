/* eslint-env mocha */

const chai = require('chai')
const chaiSubset = require('chai-subset')
chai.use(chaiSubset)
const expect = chai.expect
const tymly = require('@wmfs/tymly')
const path = require('path')
const sqlScriptRunner = require('./fixtures/sql-script-runner')
const process = require('process')
const WebSocket = require('ws')

const TYMLY_WS_PORT = 8081

describe('PG listener service tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService
  let client
  let people
  let planets
  let star

  const received = []
  let expectedTotalReceived = 0

  before(function () {
    if (process.env.PG_CONNECTION_STRING && !/^postgres:\/\/[^:]+:[^@]+@(?:localhost|127\.0\.0\.1).*$/.test(process.env.PG_CONNECTION_STRING)) {
      console.log(`Skipping tests due to unsafe PG_CONNECTION_STRING value (${process.env.PG_CONNECTION_STRING})`)
      this.skip()
    }
  })

  describe('start up', () => {
    it('boot tymly', async () => {
      process.env.TYMLY_WS_PORT = TYMLY_WS_PORT

      const tymlyServices = await tymly.boot(
        {
          pluginPaths: [
            path.resolve(__dirname, './../lib')
          ],

          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/people-blueprint'),
            path.resolve(__dirname, './fixtures/blueprints/space-blueprint')
          ]
        }
      )

      tymlyService = tymlyServices.tymly
      client = tymlyServices.storage.client
      const models = tymlyServices.storage.models
      people = models.tymlyTest_people
      planets = models.tymlyTest_planets
      star = models.tymlyTest_star

      const seededStar = await star.findById('Arcturus')
      expect(seededStar.name).to.eql('Arcturus')
      const seededPlanet = await planets.findById('Mercury')
      expect(seededPlanet.name).to.eql('Mercury')
    })

    it('connect to websocket', () => {
      const ws = new WebSocket(`ws://localhost:${TYMLY_WS_PORT}/`)

      ws.onopen = event => {
        ws.onmessage = async msg => {
          received.push(JSON.parse(msg.data))
        }
      }
    })
  })

  describe('After insert model trigger', () => {
    const key = 'tymly_test_people_afterInsert'
    let expectedReceived = 0

    it('insert a record', async () => {
      await people.create({ employeeNo: 3, firstName: 'Santa', lastName: 'Claus' })
      expectedTotalReceived++
      expectedReceived++
    })

    it('wait', done => setTimeout(done, 300))

    it('check received updates', () => {
      expect(received.length).to.eql(expectedTotalReceived)
      expect(received.filter(r => r.key === key).length).to.eql(expectedReceived)

      const { record } = received[received.length - 1]
      expect(record.employee_no).to.eql(3)
    })

    it('insert multiple records', async () => {
      await people.create([
        { employeeNo: 4, firstName: 'Santa 1', lastName: 'Claus' },
        { employeeNo: 5, firstName: 'Santa 2', lastName: 'Claus' }
      ])
      expectedTotalReceived += 2
      expectedReceived += 2
    })

    it('wait again', done => setTimeout(done, 300))

    it('check received updates for additional records', () => {
      expect(received.length).to.eql(expectedTotalReceived)
      expect(received.filter(r => r.key === key).length).to.eql(expectedReceived)
    })
  })

  describe('After delete model trigger', () => {
    const key = 'tymly_test_people_afterDelete'
    let expectedReceived = 0

    it('delete a record', async () => {
      await people.destroyById(3)
      expectedTotalReceived++
      expectedReceived++
    })

    it('wait', done => setTimeout(done, 300))

    it('check received updates', () => {
      expect(received.length).to.eql(expectedTotalReceived)
      expect(received.filter(r => r.key === key).length).to.eql(expectedReceived)

      const { record } = received[received.length - 1]
      expect(record.employee_no).to.eql(3)
    })
  })

  describe('clean up', () => {
    it('Should uninstall test schemas', async () => {
      sqlScriptRunner.uninstall(client)
    })

    it('should shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })
})
