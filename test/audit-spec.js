/* eslint-env mocha */

'use strict'

const expect = require('chai').expect
const tymly = require('@wmfs/tymly')
const path = require('path')
const sqlScriptRunner = require('./fixtures/sql-script-runner')
const process = require('process')

describe('Audit service tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService, models, client

  before(function () {
    if (process.env.PG_CONNECTION_STRING && !/^postgres:\/\/[^:]+:[^@]+@(?:localhost|127\.0\.0\.1).*$/.test(process.env.PG_CONNECTION_STRING)) {
      console.log(`Skipping tests due to unsafe PG_CONNECTION_STRING value (${process.env.PG_CONNECTION_STRING})`)
      this.skip()
    }
  })

  before('create some tymly services', async () => {
    const tymlyServices = await tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, './../lib')
        ],
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/animal-blueprint')
        ],
        config: {}
      }
    )

    tymlyService = tymlyServices.tymly
    client = tymlyServices.storage.client
    models = tymlyServices.storage.models
  })

  describe('Audited table', () => {
    function dogChanges () {
      return models.tymly_rewind.find({
        where: {
          modelName: { equals: 'tymly_test.animal_with_age' }
        },
        orderBy: ['-modified']
      })
    }
    async function dog () {
      const res = await models.tymlyTest_animalWithAge.find({})
      return res[0]
    }

    describe('insert', () => {
      it('insert a dog to animal-with-age', async () => {
        await models.tymlyTest_animalWithAge.create({
          animal: 'dog',
          colour: 'brown'
        })
      })

      it('row in table', async () => {
        const res = await dog()

        expect(res.colour).to.eql('brown')
      })

      it('insert captured in tymly.rewind', async () => {
        const res = await dogChanges()

        expect(res.length).to.eql(1)
        expect(res[0].modelName).to.eql('tymly_test.animal_with_age')
        expect(res[0].keyString).to.eql('dog')
        expect(res[0].diff.action).to.eql('insert')
      })
    })

    describe('update record', () => {
      it('update the dog\'s colour to black', async () => {
        await models.tymlyTest_animalWithAge.update({
          animal: 'dog',
          colour: 'black'
        }, {})
      })

      it('change committed', async () => {
        const res = await dog()

        expect(res.colour).to.eql('black')
      })

      it('update captured in tymly.rewind', async () => {
        const res = await dogChanges()

        expect(res.length).to.eql(2)
        expect(res[0].modelName).to.eql('tymly_test.animal_with_age')
        expect(res[0].keyString).to.eql('dog')
        expect(res[0].diff.colour.from).to.eql('brown')
        expect(res[0].diff.colour.to).to.eql('black')
      })
    })

    describe('update again', () => {
      it('update the dog\'s colour to piebald', async () => {
        await models.tymlyTest_animalWithAge.update({
          animal: 'dog',
          colour: 'piebald'
        }, {})
      })

      it('confirm row changed again', async () => {
        const res = await dog()

        expect(res.colour).to.eql('piebald')
      })

      it('second change captured in tymly.rewind', async () => {
        const res = await dogChanges()

        expect(res.length).to.eql(3)
        expect(res[0].modelName).to.eql('tymly_test.animal_with_age')
        expect(res[0].keyString).to.eql('dog')
        expect(res[0].diff.colour.from).to.eql('black')
        expect(res[0].diff.colour.to).to.eql('piebald')
      })
    })

    describe('delete record', () => {
      it('delete row', async () => {
        await models.tymlyTest_animalWithAge.destroyById('dog')
      })

      it('delete is captured in tymly.rewind', async () => {
        const res = await dogChanges()

        expect(res.length).to.eql(4)
        expect(res[0].modelName).to.eql('tymly_test.animal_with_age')
        expect(res[0].keyString).to.eql('dog')
        expect(res[0].diff.action).to.eql('delete')
      })
    })
  })

  describe('Unaudited table', () => {
    it('insert a cat to animal-with-year', async () => {
      await models.tymlyTest_animalWithYear.create({
        animal: 'cat',
        colour: 'ginger'
      })
    })

    it('check the cat is ginger', async () => {
      const res = await models.tymlyTest_animalWithYear.find({})

      expect(res[0].colour).to.eql('ginger')
    })

    it('update the cat update the cat\'s colour to white', async () => {
      await models.tymlyTest_animalWithYear.update({
        animal: 'cat',
        colour: 'white'
      }, {})
    })

    it('check the cat is white', async () => {
      const res = await models.tymlyTest_animalWithYear.find({})

      expect(res[0].colour).to.eql('white')
    })

    it('check the change has NOT been documented in tymly.rewind', async () => {
      const res = await models.tymly_rewind.find({
        where: {
          modelName: { equals: 'tymly_test.animal_with_year' }
        }
      })

      expect(res.length).to.eql(0)
    })
  })

  after('clean up animal-with-year', async () => {
    await models.tymlyTest_animalWithYear.destroyById('cat')
  })

  after('clean up rewind', async () => {
    await client.query("delete from tymly.rewind where model_name = 'tymly_test.animal_with_age'")
  })

  after('uninstall test schemas', async () => {
    await sqlScriptRunner.uninstall(client)
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
