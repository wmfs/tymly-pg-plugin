/* eslint-env mocha */

const chai = require('chai')
const chaiSubset = require('chai-subset')
chai.use(chaiSubset)
const expect = chai.expect
const tymly = require('@wmfs/tymly')
const path = require('path')
const sqlScriptRunner = require('./fixtures/sql-script-runner')
const process = require('process')

describe('PG storage service tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService
  let storage
  let client
  let people
  let planets
  let star
  let asteroids

  before(function () {
    if (process.env.PG_CONNECTION_STRING && !/^postgres:\/\/[^:]+:[^@]+@(?:localhost|127\.0\.0\.1).*$/.test(process.env.PG_CONNECTION_STRING)) {
      console.log(`Skipping tests due to unsafe PG_CONNECTION_STRING value (${process.env.PG_CONNECTION_STRING})`)
      this.skip()
    }
  })

  describe('start up', () => {
    it('boot tymly', async () => {
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
      storage = tymlyServices.storage
      client = tymlyServices.storage.client
      const models = tymlyServices.storage.models
      people = models.tymlyTest_people
      planets = models.tymlyTest_planets
      star = models.tymlyTest_star
      asteroids = tymlyServices.storage.sequences.tymlyTest_asteroids

      const seededStar = await star.findById('Arcturus')
      expect(seededStar.name).to.eql('Arcturus')
      const seededPlanet = await planets.findById('Mercury')
      expect(seededPlanet.name).to.eql('Mercury')
    })
  })

  describe('single table', () => {
    it('create a new person', async () => {
      const idProperties = await people.create(
        {
          employeeNo: '1',
          firstName: 'Homer',
          lastName: 'Simpson',
          age: 39
        },
        {}
      )

      expect(idProperties).to.eql({
        idProperties: {
          employeeNo: '1'
        }
      })
    })

    it('create multiple new people', async () => {
      await people.create(
        [
          {
            employeeNo: '2',
            firstName: 'Maggie',
            lastName: 'Simpson'
          },
          {
            employeeNo: '3',
            firstName: 'Lisa',
            lastName: 'Simpson',
            age: 8
          },
          {
            employeeNo: '4',
            firstName: 'Marge',
            lastName: 'Simpson',
            age: 36
          },
          {
            employeeNo: '5',
            firstName: 'Bart',
            lastName: 'Simpson',
            age: 10
          }
        ],
        {}
      )
    })

    it('fail when primary key already used', async () => {
      try {
        await people.create(
          {
            employeeNo: '1',
            firstName: 'Ned',
            lastName: 'Flanders',
            age: 60
          },
          {}
        )
      } catch (err) {
        return
      }

      expect.fail('Should have thrown')
    })

    it('fail creating new people with an already-used primary key', async () => {
      try {
        await people.create(
          [
            {
              employeeNo: '6',
              firstName: 'Ned',
              lastName: 'Flanders',
              age: 60
            },
            {
              employeeNo: '2',
              firstName: 'Maude',
              lastName: 'Flanders'
            }
          ],
          {}
        )
      } catch (err) {
        return
      }

      expect.fail('Should have thrown')
    })

    it('find a person by primary key', async () => {
      const doc = await people.findById(3)

      expect(doc).to.containSubset(
        {
          employeeNo: '3',
          firstName: 'Lisa',
          lastName: 'Simpson',
          age: 8
        }
      )
    })

    it('find nothing for an unknown primary key', async () => {
      const doc = await people.findById(0)

      expect(doc).to.equal(undefined)
    })

    it('find 5 people, order youngest first', async () => {
      const doc = await people.find(
        {
          orderBy: ['age']
        }
      )

      expect(doc[0].age).to.equal(8)
      expect(doc[1].age).to.equal(10)
      expect(doc[2].age).to.equal(36)
      expect(doc[3].age).to.equal(39)
      expect(doc).to.containSubset(
        [
          {
            age: 8,
            employeeNo: '3',
            firstName: 'Lisa',
            lastName: 'Simpson'
          },
          {
            age: 10,
            employeeNo: '5',
            firstName: 'Bart',
            lastName: 'Simpson'
          },
          {
            age: 36,
            employeeNo: '4',
            firstName: 'Marge',
            lastName: 'Simpson'
          },
          {
            age: 39,
            employeeNo: '1',
            firstName: 'Homer',
            lastName: 'Simpson'
          },
          {
            employeeNo: '2',
            firstName: 'Maggie',
            lastName: 'Simpson'
          }
        ]
      )
    })

    it('find Bart by name', async () => {
      const doc = await people.find(
        {
          where: {
            firstName: { equals: 'Bart' },
            lastName: { equals: 'Simpson' }
          }
        }
      )

      expect(doc).to.have.length(1)
      expect(doc).to.containSubset(
        [
          {
            age: 10,
            employeeNo: '5',
            firstName: 'Bart',
            lastName: 'Simpson'
          }
        ]
      )
    })

    it('find Marge and Homer, (order by/offset 2/limit 2)', async () => {
      const doc = await people.find(
        {
          orderBy: ['age'],
          limit: 2,
          offset: 2
        }
      )

      expect(doc).to.have.length(2)
      expect(doc[0].employeeNo).to.eql('4')
      expect(doc[1].employeeNo).to.eql('1')
      expect(doc).to.containSubset(
        [
          {
            employeeNo: '4',
            firstName: 'Marge',
            lastName: 'Simpson',
            age: 36
          },
          {
            employeeNo: '1',
            firstName: 'Homer',
            lastName: 'Simpson',
            age: 39
          }
        ]
      )
    })

    it('findOne second youngest known person (orderBy/offset)', async () => {
      const doc = await people.findOne(
        {
          orderBy: ['age'],
          offset: 1
        }
      )

      expect(doc).to.containSubset(
        {
          age: 10,
          employeeNo: '5',
          firstName: 'Bart',
          lastName: 'Simpson'
        }
      )
    })

    it('findOne by name', async () => {
      const doc = await people.findOne(
        {
          where: {
            firstName: { equals: 'Homer' },
            lastName: { equals: 'Simpson' }
          }
        }
      )

      expect(doc).to.containSubset(
        {
          age: 39,
          employeeNo: '1',
          firstName: 'Homer',
          lastName: 'Simpson'
        }
      )
    })

    it('findOne return nothing for unknown person', async () => {
      const doc = await people.findOne(
        {
          where: {
            firstName: { equals: 'Maude' },
            lastName: { equals: 'Flanders' }
          }
        }
      )

      expect(doc).to.equal(undefined)
    })

    it("update Maggie's age to 1", async () => {
      await people.update(
        {
          employeeNo: '2',
          age: 1,
          firstName: 'Maggie',
          lastName: 'Simpson'
        },
        {}
      )
    })

    it('Maggie has an age', async () => {
      const doc = await people.findById(2)

      expect(doc).to.containSubset(
        {
          employeeNo: '2',
          firstName: 'Maggie',
          lastName: 'Simpson',
          age: 1
        }
      )
    })

    it('update Maggie again, this time without an age', async () => {
      await people.update(
        {
          employeeNo: '2',
          firstName: 'Maggie',
          lastName: 'Simpson'
        },
        {}
      )
    })

    it("Maggie's age has gone again", async () => {
      const doc = await people.findById(2)

      expect(doc).to.containSubset(
        {
          employeeNo: '2',
          firstName: 'Maggie',
          lastName: 'Simpson'
        }
      )
    })

    it('delete Maggie by id', async () => {
      await people.destroyById(2)
    })

    it('can not find a deleted record', async () => {
      const doc = await people.findById(2)

      expect(doc).to.equal(undefined)
    })

    it('upsert (insert) a person', async () => {
      const idProperties = await people.upsert(
        {
          employeeNo: '4',
          firstName: 'Marge',
          lastName: 'Simpson',
          age: 45,
          children: { name: 'Lisa', age: 13 }
        },
        {}
      )

      expect(idProperties).to.eql(
        {
          idProperties: {
            employeeNo: '4'
          }
        }
      )
    })

    it('upsert (insert) a person with an array subobject', async () => {
      const idProperties = await people.upsert(
        {
          employeeNo: '4',
          firstName: 'Marge',
          lastName: 'Simpson',
          age: 45,
          children: [
            { name: 'Lisa', age: 13 },
            { name: 'Bart', age: 12 }
          ]
        },
        {}
      )

      expect(idProperties).to.eql(
        {
          idProperties: {
            employeeNo: '4'
          }
        }
      )
    })

    it('upsert (insert) Grampa', async () => {
      const idProperties = await people.upsert(
        {
          employeeNo: '10',
          firstName: 'Abe',
          lastName: 'Simpson',
          age: 82
        },
        {}
      )

      expect(idProperties).to.eql(
        {
          idProperties: {
            employeeNo: '10'
          }
        }
      )
    })

    it('find Grampa by id', async () => {
      const doc = await people.findById(10)

      expect(doc).to.containSubset(
        {
          employeeNo: '10',
          firstName: 'Abe',
          lastName: 'Simpson',
          age: 82
        }
      )
    })

    it('upsert (update) Grampa', async () => {
      await people.upsert(
        {
          employeeNo: '10',
          firstName: 'Abraham',
          lastName: 'Simpson',
          age: 83
        },
        {}
      )
    })

    it('find Grampa by id, verify update', async () => {
      const doc = await people.findById(10)

      expect(doc).to.containSubset(
        {
          employeeNo: '10',
          firstName: 'Abraham',
          lastName: 'Simpson',
          age: 83
        }
      )
    })
  })

  describe('reference table, loaded as seed data', () => {
    it('find star via primary key', async () => {
      const doc = await star.findById('Proxima Centauri')

      expect(doc).to.containSubset(
        {
          name: 'Proxima Centauri',
          type: 'Red Dwarf'
        }
      )
    })
  })

  describe('related tables', () => {
    it('create mars, with two moons and a few craters', async () => {
      const idProperties = await planets.create(
        {
          name: 'mars',
          title: 'Mars',
          type: 'Terrestrial',
          diameter: 6700,
          color: 'red',
          url: 'http://en.wikipedia.org/wiki/Mars',
          moons: [
            {
              title: 'Phobos',
              discoveredBy: 'Asaph Hall',
              discoveryYear: 1800,
              craters: [
                {
                  title: 'Stickney',
                  diameter: 9
                }
              ]
            },
            {
              title: 'Deimos',
              discoveredBy: 'Asaph Hall',
              discoveryYear: 1800
            }
          ]
        },
        {}
      )

      expect(idProperties).to.eql(
        {
          idProperties: {
            name: 'mars'
          }
        }
      )
    })
  })

  describe('set created by and modified by', () => {
    it('create a new person', async () => {
      storage.setCurrentUser('test')

      const properties = await people.create(
        {
          employeeNo: '1000',
          firstName: 'James',
          lastName: 'Thompson',
          age: 39
        },
        {}
      )
      storage.setCurrentUser(null)

      expect(properties).to.eql(
        {
          idProperties: { employeeNo: '1000' }
        }
      )
    })

    it('find person, check createdBy', async () => {
      const doc = await people.findOne(
        {
          where: {
            employeeNo: { equals: '1000' }
          }
        }
      )

      expect(doc).to.containSubset(
        {
          employeeNo: '1000',
          firstName: 'James',
          lastName: 'Thompson',
          age: 39,
          createdBy: 'test'
        }
      )
    })

    it('upsert record', async () => {
      storage.setCurrentUser(() => 'modifier')
      await people.patch(
        {
          employeeNo: '1000',
          firstName: 'Jim'
        },
        {}
      )
      storage.setCurrentUser(null)
    })

    it('find person, check modifiedBy', async () => {
      const doc = await people.findOne(
        {
          where: {
            employeeNo: { equals: '1000' }
          }
        }
      )

      expect(doc).to.containSubset(
        {
          employeeNo: '1000',
          firstName: 'Jim',
          lastName: 'Thompson',
          age: 39,
          createdBy: 'test',
          modifiedBy: 'modifier'
        }
      )
    })
  })

  describe('sequences', () => {
    it('should detect a sequence for asteroids', async () => {
      const res = await storage.checkSequenceExists('tymlyTest_asteroids', storage.sequences)
      expect(res.startWith).to.eql(1)
      expect(res.namespace).to.eql('tymlyTest')
      expect(res.id).to.eql('asteroids')
      expect(res.name).to.eql('asteroids')
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
