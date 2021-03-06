'use strict'

const _ = require('lodash')

function generateTriggerStatement (model, triggerName, func, action) {
  const namespace = _.snakeCase(model.namespace)
  const name = _.snakeCase(model.name)
  const pk = model.primaryKey.map(_.snakeCase).join(',')

  switch (action) {
    case 'ADD':
      return `CREATE TRIGGER ${triggerName} 
      ${func.when} ON ${namespace}.${name} 
      FOR EACH ROW EXECUTE PROCEDURE 
      tymly.${_.snakeCase(func.name)}('${namespace}.${name}', '{${pk}}');`
    case 'REMOVE':
      return `DROP TRIGGER IF EXISTS ${triggerName}
      ON ${namespace}.${name};`
    default:
      return ''
  }
}

module.exports = generateTriggerStatement
