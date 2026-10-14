class PostgresqlScriptService {
  async boot (options) {
    await this._runScripts(
      options.bootedServices.storage.client,
      options.blueprintComponents.pgScripts,
      options.messages
    )
  }

  async _runScripts (client, scripts, messages) {
    messages.info('Scripts:')

    const scriptNames = Object.keys(scripts || {})
    if (!scriptNames.length) {
      messages.detail('No scripts found')
      return
    }

    // Run one at a time, in a stable order, so scripts that depend
    // on objects created by earlier scripts don't race each other
    for (const script of scriptNames) {
      messages.detail(script)
      await client.runFile(scripts[script].filePath)
    }
  }
}

module.exports = {
  serviceClass: PostgresqlScriptService,
  bootAfter: ['storage']
}
