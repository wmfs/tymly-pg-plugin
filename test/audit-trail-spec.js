/* eslint-env mocha */

const expect = require('chai').expect
const DateTime = require('luxon').DateTime
const AuditTrail = require('../lib/components/state-resources/audit-trail')
const AuditService = require('../lib/components/services/audit').serviceClass

const rawHistory = [
  {
    modelName: 'test_animal',
    keyString: 'dog_henry',
    oldValues: {
      name: 'henry',
      colour: null,
      size: 'small',
      animal: 'dog'
    },
    diff: {
      action: 'insert'
    },
    modifiedBy: 'bob',
    modified: DateTime.fromObject({
      year: 2018,
      month: 12,
      day: 1,
      hour: 10,
      minute: 0
    }).toJSDate()
  },
  {
    modelName: 'test_animal',
    keyString: 'dog_henry',
    oldValues: {
      name: 'henry',
      colour: null,
      size: 'small',
      animal: 'dog'
    },
    diff: {
      colour: {
        from: '',
        to: 'brown'
      }
    },
    modifiedBy: 'bob',
    modified: DateTime.fromObject({
      year: 2018,
      month: 12,
      day: 1,
      hour: 11,
      minute: 0
    }).toJSDate()
  },
  {
    modelName: 'test_animal',
    keyString: 'dog_henry',
    oldValues: {
      name: 'henry',
      colour: 'brown',
      size: 'small',
      animal: 'dog'
    },
    diff: {
      colour: {
        from: 'brown',
        to: 'black'
      },
      smell: {
        from: 'bad',
        to: 'good'
      }
    },
    modifiedBy: 'bill',
    modified: DateTime.fromObject({
      year: 2018,
      month: 12,
      day: 1,
      hour: 12,
      minute: 0
    }).toJSDate()
  },
  {
    modelName: 'test_animal',
    keyString: 'dog_henry',
    oldValues: {
      name: 'henry',
      colour: 'black',
      size: 'small',
      animal: 'dog'
    },
    diff: {
      size: {
        from: 'small',
        to: ''
      }
    },
    modifiedBy: 'bill',
    modified: DateTime.fromObject({
      year: 2018,
      month: 12,
      day: 1,
      hour: 12,
      minute: 5
    }).toJSDate()
  },
  {
    modelName: 'test_animal',
    keyString: 'dog_henry',
    oldValues: {
      name: 'henry',
      colour: null,
      size: 'small',
      animal: 'dog'
    },
    diff: {
      action: 'delete'
    },
    modifiedBy: 'bob',
    modified: DateTime.fromObject({
      year: 2028,
      month: 12,
      day: 1,
      hour: 10,
      minute: 0
    }).toJSDate()
  }
]

const formattedHistory = [
  {
    change: 'Delete',
    modifiedBy: 'bob',
    modified: '10:00 Dec 1, 2028'
  },
  {
    change: 'Size "small" was cleared',
    modifiedBy: 'bill',
    modified: '12:05 Dec 1, 2018'
  },
  {
    change: 'Colour changed from "brown" to "black"',
    modifiedBy: 'bill',
    modified: '12:00 Dec 1, 2018'
  },
  {
    change: 'Colour set to "brown"',
    modifiedBy: 'bob',
    modified: '11:00 Dec 1, 2018'
  },
  {
    change: 'Insert',
    modifiedBy: 'bob',
    modified: '10:00 Dec 1, 2018'
  }
]

function rewindMock (opts) {
  expect(opts.where.modelName).to.eql({ equals: 'test_animal' })
  expect(opts.where.keyString).to.eql({ equals: 'dog_henry' })

  return rawHistory
} // rewindMock

describe('Audit Trail tests', () => {
  const env = {
    bootedServices: {
      storage: {
        models: {
          tymly_rewind: {
            find: rewindMock
          }
        }
      }
    },
    blueprintComponents: {
      models: {
        test_animal: {
          properties: {
            name: {
              title: 'Name'
            },
            colour: {
              title: 'Colour'
            },
            size: {
              title: 'Size'
            },
            smell: {
              title: 'Smell',
              audit: 'raw'
            }
          }
        }
      },
      pgScripts: { }
    }
  }

  const auditService = new AuditService()
  auditService.boot(env)
  env.bootedServices.audit = auditService

  let auditTrail

  before(() => {
    auditTrail = new AuditTrail()
    auditTrail.init(
      null,
      env,
      () => {}
    )
  })

  function check (res, expected, done) {
    try {
      expect(res).to.eql(expected)
      done()
    } catch (e) {
      done(e)
    }
  }

  const event = {
    model: 'test_animal',
    keys: {
      animal: 'dog',
      name: 'henry'
    },
    format: 'raw'
  }

  const tests = [
    [
      'raw',
      'raw',
      rawHistory
    ],
    [
      'formatted',
      null,
      formattedHistory
    ]
  ]

  for (const [label, format, expected] of tests) {
    it(`${label} logs `, done => {
      auditTrail.run(
        {
          ...event,
          format
        },
        {
          sendTaskSuccess: logs => check(logs, expected, done)
        }
      )
    })
  }
})
