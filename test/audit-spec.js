/* eslint-env mocha */

'use strict'

const expect = require('chai').expect
const tymly = require('@wmfs/tymly')
const path = require('path')
const sqlScriptRunner = require('./fixtures/sql-script-runner')
const process = require('process')

describe('Audit service tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService, models, rewindIdToDestroy, client

  before(function () {
    if (process.env.PG_CONNECTION_STRING && !/^postgres:\/\/[^:]+:[^@]+@(?:localhost|127\.0\.0\.1).*$/.test(process.env.PG_CONNECTION_STRING)) {
      console.log(`Skipping tests due to unsafe PG_CONNECTION_STRING value (${process.env.PG_CONNECTION_STRING})`)
      this.skip()
    }
  })

  it('create some tymly services', (done) => {
    tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, './../lib')
        ],
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/animal-blueprint')
        ],
        config: {}
      },
      (err, tymlyServices) => {
        expect(err).to.eql(null)
        tymlyService = tymlyServices.tymly
        client = tymlyServices.storage.client
        models = tymlyServices.storage.models
        done(err)
      }
    )
  })

  it('insert a dog to animal-with-age', async () => {
    await models.tymlyTest_animalWithAge.create({
      animal: 'dog',
      colour: 'brown'
    })
  })

  it('check the dog is brown', async () => {
    const res = await models.tymlyTest_animalWithAge.find({})

    expect(res[0].colour).to.eql('brown')
  })

  it('update the dog\'s colour to black', async () => {
    await models.tymlyTest_animalWithAge.update({
      animal: 'dog',
      colour: 'black'
    }, {})
  })

  it('confirm dog is black', async () => {
    const res = await models.tymlyTest_animalWithAge.find({})

    expect(res[0].colour).to.eql('black')
  })

  it('check the change has been documented in tymly.rewind', async () => {
    const res = await models.tymly_rewind.find({
      where: {
        modelName: { equals: 'tymly_test.animal_with_age' }
      }
    })

    rewindIdToDestroy = res[0].id
    expect(res[0].modelName).to.eql('tymly_test.animal_with_age')
    expect(res[0].keyString).to.eql('dog')
    expect(res[0].diff.colour.from).to.eql('brown')
    expect(res[0].diff.colour.to).to.eql('black')
  })

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

  it('clean up animal-with-age', async () => {
    await models.tymlyTest_animalWithAge.destroyById('dog')
  })

  it('clean up animal-with-year', async () => {
    await models.tymlyTest_animalWithYear.destroyById('cat')
  })

  it('clean up rewind', async () => {
    await models.tymly_rewind.destroyById(rewindIdToDestroy)
  })

  it('uninstall test schemas', async () => {
    await sqlScriptRunner.uninstall(client)
  })

  it('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
