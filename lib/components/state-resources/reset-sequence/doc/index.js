module.exports = {
  description: 'Resets the specified sequence so its next value is 1. ' +
    'If the sequence definition sets "resetsYearly": true, the current calendar year\'s numbering restarts at the ' +
    'sequence\'s startWith instead. Yearly sequences restart automatically each year, so this is not needed at New Year.',
  example: require('./example.json')
}
