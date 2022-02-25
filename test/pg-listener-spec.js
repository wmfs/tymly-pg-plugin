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

const TYMLY_WS_PORT = 8082

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

  describe('Before and after insert model trigger', () => {
    const afterInsertKey = 'tymlyTest_people_afterInsert'
    const beforeInsertKey = 'tymlyTest_people_beforeInsert'

    let expectedReceived = 0

    it('insert a record', async () => {
      await people.create({ employeeNo: 3, firstName: 'Santa', lastName: 'Claus' })
      expectedTotalReceived += 2
      expectedReceived++
    })

    it('wait', done => setTimeout(done, 300))

    it('check received updates', () => {
      expect(received.length).to.eql(expectedTotalReceived)
      expect(received.filter(r => r.key === beforeInsertKey).length).to.eql(expectedReceived)
      expect(received.filter(r => r.key === afterInsertKey).length).to.eql(expectedReceived)

      const { record } = received[received.length - 1]
      expect(record.employeeNo).to.eql(3)
    })

    it('insert multiple records', async () => {
      const records = [
        { employeeNo: 4, firstName: 'Santa 1', lastName: 'Claus' },
        { employeeNo: 5, firstName: 'Santa 2', lastName: 'Claus' }
      ]
      await people.create(records)
      expectedTotalReceived += records.length * 2
      expectedReceived += 2
    })

    it('wait again', done => setTimeout(done, 300))

    it('check received updates for additional records', () => {
      expect(received.length).to.eql(expectedTotalReceived)
      expect(received.filter(r => r.key === beforeInsertKey).length).to.eql(expectedReceived)
      expect(received.filter(r => r.key === afterInsertKey).length).to.eql(expectedReceived)
    })
  })

  describe('Before and after update model trigger', () => {
    const afterUpdateKey = 'tymlyTest_people_afterUpdate'
    const beforeUpdateKey = 'tymlyTest_people_beforeUpdate'

    let expectedReceived = 0

    it('update a record', async () => {
      await people.update({ employeeNo: 3, firstName: 'Mrs', lastName: 'Claus' })
      expectedTotalReceived += 2
      expectedReceived++
    })

    it('wait', done => setTimeout(done, 300))

    it('check received updates', () => {
      expect(received.length).to.eql(expectedTotalReceived)
      expect(received.filter(r => r.key === beforeUpdateKey).length).to.eql(expectedReceived)
      expect(received.filter(r => r.key === afterUpdateKey).length).to.eql(expectedReceived)

      const { record } = received[received.length - 1]
      expect(record.employeeNo).to.eql(3)
    })
  })

  describe('Before and after delete model trigger', () => {
    const beforeDeleteKey = 'tymlyTest_people_beforeDelete'
    const afterDeleteKey = 'tymlyTest_people_afterDelete'

    let expectedReceived = 0

    it('delete a record', async () => {
      await people.destroyById(3)
      expectedTotalReceived += 2
      expectedReceived++
    })

    it('wait', done => setTimeout(done, 300))

    it('check received updates', () => {
      expect(received.length).to.eql(expectedTotalReceived)
      expect(received.filter(r => r.key === beforeDeleteKey).length).to.eql(expectedReceived)
      expect(received.filter(r => r.key === afterDeleteKey).length).to.eql(expectedReceived)

      const { record } = received[received.length - 1]
      expect(record.employeeNo).to.eql(3)
    })
  })

  describe('Call Tymly PG notification from outside Tymly', () => {
    it('Call pg_notify', async () => {
      await client.query('SELECT pg_notify(\'TYMLY_NOTIFICATION\', to_jsonb(\'{ "key": "rainbow_veryColourful_afterUpdate", "record": "test" }\'::text)::text);')
      expectedTotalReceived++
    })

    it('wait', done => setTimeout(done, 300))

    it('check received updates for additional records', () => {
      expect(received.length).to.eql(expectedTotalReceived)
      const last = received[received.length - 1]
      expect(last.key).to.eql('rainbow_veryColourful_afterUpdate')
      expect(last.record).to.eql('test')
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
