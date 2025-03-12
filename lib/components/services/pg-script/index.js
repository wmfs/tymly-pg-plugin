class PostgresqlScriptService {
  async boot (options) {
    await this._runScripts(
      options.bootedServices.storage.client,
      options.blueprintComponents.pgScripts,
      options.messages
    )
  }

  _runScripts (client, scripts, messages) {
    messages.info('Scripts:')

    if (!scripts) {
      messages.detail('No scripts found')
    }

    const scriptInstallers = Object.keys(scripts).map(script => {
      messages.detail(script)
      return client.runFile(scripts[script].filePath)
    })

    return Promise.all(scriptInstallers)
  }
}

module.exports = {
  serviceClass: PostgresqlScriptService,
  bootAfter: ['storage']
}
