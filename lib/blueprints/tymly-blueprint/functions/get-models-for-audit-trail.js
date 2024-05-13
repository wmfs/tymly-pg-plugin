module.exports = function getModelsForAuditTrail () {
  return function (env) {
    const modelPrimaryKeys = {}
    const models = Object.values(env.bootedServices.storage.models).map(model => {
      modelPrimaryKeys[model.fullModelId] = model.pkColumnNames
      return {
        title: model.fullModelId,
        value: model.fullModelId
      }
    })
    return {
      availableModels: models,
      availableModelsOrig: models,
      availableModelsFilt: models,
      modelPrimaryKeys
    }
  }
}
