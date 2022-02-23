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
  let expectedReceived = 0

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
          received.push(msg.data)
        }
      }
    })
  })

  describe('After insert model trigger', () => {
    it('insert some data', async () => {
      await people.create({
        employeeNo: 3,
        firstName: 'Santa',
        lastName: 'Claus'
      })
      expectedReceived++
    })

    it('wait', done => setTimeout(done, 300))

    it('check received updates', () => {
      expect(received.length).to.eql(expectedReceived)
      const { key, record } = JSON.parse(received[received.length - 1])
      expect(key).to.eql('tymly_test_people_afterInsert')
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
