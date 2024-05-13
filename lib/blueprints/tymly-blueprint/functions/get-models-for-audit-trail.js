module.exports = function getModelsForAuditTrail () {
  return function (env) {
    const models = Object.values(env.bootedServices.storage.models).map(model => {
      return {
        title: model.fullTableName,
        value: model.fullTableName
      }
    })
    return {
      availableModels: models,
      availableModelsOrig: models,
      availableModelsFilt: models
    }
  }
}
