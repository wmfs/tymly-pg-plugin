/* eslint-env mocha */

'use strict'

const chai = require('chai')
const chaiSubset = require('chai-subset')
chai.use(chaiSubset)
const expect = chai.expect
const tymly = require('@wmfs/tymly')
const path = require('path')
const process = require('process')
const HlPgClient = require('@wmfs/hl-pg-client')

// thisYear is worked out once, separately from the code under test, so these tests would fail if
// run across midnight on New Year's Eve.
const YEAR_SQL = "SELECT extract(year from (now() at time zone 'Europe/London'))::integer AS year"
const CLEAR_TEST_ROWS = "DELETE FROM tymly.yearly_sequence WHERE id LIKE 'tymlyTest\\_%'"

describe('Yearly sequences', function () {
  this.timeout(process.env.TIMEOUT || 5000)
  let setupClient, client, storage, tymlyService, statebox, thisYear

  async function reboot () {
    if (tymlyService) await tymlyService.shutdown()
    const tymlyServices = await tymly.boot({
      pluginPaths: [path.resolve(__dirname, './../lib')],
      blueprintPaths: [path.resolve(__dirname, './fixtures/blueprints/sequence-blueprint')],
      config: {}
    })
    tymlyService = tymlyServices.tymly
    client = tymlyServices.storage.client
    storage = tymlyServices.storage
    statebox = tymlyServices.statebox
  }

  async function run (stateMachineName) {
    const executionDescription = await statebox.startExecution(
      {},
      `tymlyTest_${stateMachineName}_1_0`,
      { sendResponse: 'COMPLETE' }
    )
    expect(executionDescription.status).to.eql('SUCCEEDED')
    return executionDescription.ctx.sequence
  }

  before(function () {
    if (process.env.PG_CONNECTION_STRING && !/^postgres:\/\/[^:]+:[^@]+@(?:localhost|127\.0\.0\.1).*$/.test(process.env.PG_CONNECTION_STRING)) {
      console.log(`Skipping tests due to unsafe PG_CONNECTION_STRING value (${process.env.PG_CONNECTION_STRING})`)
      this.skip()
    }
  })

  before('set up a legacy sequence that has already issued 41 values this year', async () => {
    setupClient = new HlPgClient(process.env.PG_CONNECTION_STRING)
    await setupClient.query('DROP SCHEMA IF EXISTS tymly_test CASCADE')
    await setupClient.query('CREATE SCHEMA tymly_test')
    await setupClient.query('CREATE SEQUENCE tymly_test.legacy_yearly_seq START WITH 1')
    await setupClient.query("SELECT setval('tymly_test.legacy_yearly_seq', 41)")
    await setupClient.query(CLEAR_TEST_ROWS).catch(() => {}) // table won't exist on a fresh database
    thisYear = (await setupClient.query(YEAR_SQL)).rows[0].year
  })

  it('boot Tymly', async () => {
    await reboot()
  })

  it('carries an existing sequence\'s position into the current year on first boot', async () => {
    const sequence = await run('findNextLegacyYearlySequenceValue')
    expect(sequence).to.eql({ value: '42', year: thisYear })
  })

  it('current value is startWith - 1 before anything is issued this year', async () => {
    const sequence = await run('findCurrentYearlySequenceValue')
    expect(sequence).to.eql({ value: '0', year: thisYear })
  })

  it('issues 1, then 2, with the year alongside', async () => {
    expect(await run('findNextYearlySequenceValue')).to.eql({ value: 'TKT1', year: thisYear })
    expect(await run('findNextYearlySequenceValue')).to.eql({ value: 'TKT2', year: thisYear })
    expect(await run('findCurrentYearlySequenceValue')).to.eql({ value: '2', year: thisYear })
  })

  it('starts again at 1 when the year turns over', async () => {
    // Pretend everything issued so far was issued last year
    await client.query(
      "UPDATE tymly.yearly_sequence SET year = year - 1 WHERE id = 'tymlyTest_yearlyTicketIdSeq'"
    )
    expect(await run('findCurrentYearlySequenceValue')).to.eql({ value: '0', year: thisYear })
    expect(await run('findNextYearlySequenceValue')).to.eql({ value: 'TKT1', year: thisYear })

    const { rows } = await client.query(
      "SELECT year, value FROM tymly.yearly_sequence WHERE id = 'tymlyTest_yearlyTicketIdSeq' ORDER BY year"
    )
    expect(rows).to.eql([
      { year: thisYear - 1, value: '2' },
      { year: thisYear, value: '1' }
    ])
  })

  it('does not hand out duplicates when called concurrently', async () => {
    const results = await Promise.all(
      Array.from({ length: 20 }, () => run('findNextYearlySequenceValue'))
    )
    const values = results.map(r => r.value).sort()
    expect(new Set(values).size).to.eql(20)
    expect(await run('findCurrentYearlySequenceValue')).to.eql({ value: '21', year: thisYear })
  })

  it('resetSequence restarts the current year', async () => {
    await run('resetYearlySequence')
    expect(await run('findNextYearlySequenceValue')).to.eql({ value: 'TKT1', year: thisYear })
  })

  it('starts again if the sequence is dropped and recreated on reboot', async () => {
    await tymlyService.shutdown()
    tymlyService = null
    await setupClient.query('DROP SCHEMA tymly_test CASCADE')
    await setupClient.query('CREATE SCHEMA tymly_test')
    await reboot()

    expect(await run('findNextYearlySequenceValue')).to.eql({ value: 'TKT1', year: thisYear })
    expect(await run('findNextLegacyYearlySequenceValue')).to.eql({ value: '1', year: thisYear })
  })

  it('keeps counting across a normal reboot', async () => {
    await reboot()
    expect(await run('findNextYearlySequenceValue')).to.eql({ value: 'TKT2', year: thisYear })
  })

  describe('a sequence with startWith 100', () => {
    it('current value is 99 before anything is issued', async () => {
      expect(await run('findCurrentYearlyOffsetSequenceValue')).to.eql({ value: '99', year: thisYear })
    })

    it('issues 100, then 101', async () => {
      expect(await run('findNextYearlyOffsetSequenceValue')).to.eql({ value: '100', year: thisYear })
      expect(await run('findNextYearlyOffsetSequenceValue')).to.eql({ value: '101', year: thisYear })
    })

    it('restarts at 100 after a reset', async () => {
      await run('resetYearlyOffsetSequence')
      expect(await run('findCurrentYearlyOffsetSequenceValue')).to.eql({ value: '99', year: thisYear })
      expect(await run('findNextYearlyOffsetSequenceValue')).to.eql({ value: '100', year: thisYear })
    })

    it('still restarts at 100 if Tymly reboots straight after a reset', async () => {
      await run('resetYearlyOffsetSequence')
      await reboot()
      expect(await run('findNextYearlyOffsetSequenceValue')).to.eql({ value: '100', year: thisYear })
    })
  })

  describe('several instances booting together', () => {
    it('set up their yearly sequences once, without errors or duplicates', async () => {
      const key = 'tymlyTest_yearlyTicketIdSeq'
      const sqlId = 'tymly_test.yearly_ticket_id_seq'
      const definition = storage.sequences[key]
      await run('findNextYearlySequenceValue')
      await run('findNextYearlySequenceValue') // this year is now on 4
      await setupClient.query(`DROP SEQUENCE ${sqlId}`)

      // Each call runs on its own pooled connection, like separate instances booting at once.
      // Only one of them should find the sequence missing and clear its yearly numbering.
      const warnings = []
      await Promise.all(
        Array.from({ length: 5 }, () => storage._initYearlySequence(key, sqlId, definition, { warning: w => warnings.push(w) }))
      )
      expect(warnings.length).to.eql(1)

      const { rows } = await client.query('SELECT year, value FROM tymly.yearly_sequence WHERE id = $1', [key])
      expect(rows).to.eql([{ year: thisYear, value: '0' }])
      expect(await run('findNextYearlySequenceValue')).to.eql({ value: 'TKT1', year: thisYear })
    })
  })

  after('clean up', async () => {
    if (!setupClient) return
    await setupClient.query(CLEAR_TEST_ROWS)
    await setupClient.query('DROP SCHEMA IF EXISTS tymly_test CASCADE')
    await setupClient.end()
  })

  after('should shutdown Tymly', async () => {
    if (tymlyService) await tymlyService.shutdown()
  })
})
