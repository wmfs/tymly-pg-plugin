module.exports = {
  description: 'Gets the current value from the specified sequence, returning it as the value of the value property. ' +
    'If the sequence definition sets "resetsYearly": true, this is the last value issued in the current calendar year ' +
    '(Europe/London, or the sequence\'s "timezone"), or startWith - 1 if none has been issued yet, and the current year ' +
    'is returned as the year property.',
  example: require('./example.json')
}
