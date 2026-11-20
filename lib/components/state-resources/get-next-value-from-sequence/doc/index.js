module.exports = {
  description: 'Gets the next value from the specified sequence, returning it as the value of the value property. ' +
    'If the sequence definition sets "resetsYearly": true, numbering restarts at startWith each calendar year ' +
    '(Europe/London, or the sequence\'s "timezone"), and the year the value belongs to is returned as the year property.',
  example: require('./example.json')
}
