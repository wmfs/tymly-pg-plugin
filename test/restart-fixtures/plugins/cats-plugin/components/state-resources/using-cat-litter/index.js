'use strict'

module.exports = class Sitting {
  run (event, context) {
    event.petDiary.push(`Stand back, ${event.petName} is using the cat litter!`)
    context.sendTaskSuccess(
      {
        hoursSinceLastMotion: 0,
        petDiary: event.petDiary
      }
    )
  }
}
