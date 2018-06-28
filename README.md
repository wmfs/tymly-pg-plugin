# tymly-pg-plugin
[![Tymly Package](https://img.shields.io/badge/tymly-package-blue.svg)](https://tymly.io/)
[![npm (scoped)](https://img.shields.io/npm/v/@wmfs/tymly-pg-plugin.svg)](https://www.npmjs.com/package/@wmfs/tymly-pg-plugin)
[![Build Status](https://travis-ci.org/wmfs/tymly-pg-plugin.svg?branch=master)](https://travis-ci.org/wmfs/tymly-pg-plugin)
[![codecov](https://codecov.io/gh/wmfs/tymly-pg-plugin/branch/master/graph/badge.svg)](https://codecov.io/gh/wmfs/tymly-pg-plugin)
[![CodeFactor](https://www.codefactor.io/repository/github/wmfs/tymly-pg-plugin/badge)](https://www.codefactor.io/repository/github/wmfs/tymly-pg-plugin)
[![Dependabot badge](https://img.shields.io/badge/Dependabot-active-brightgreen.svg)](https://dependabot.com/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/wmfs/tymly-pg-plugin/blob/master/LICENSE)


> Plugin for [TymlyJS](http://www.tymlyjs.io) that provides PostgreSQL persistence

## <a name="install"></a>Install
```bash
$ npm install pg-info --save
```

## <a name="services"></a>Services
### Audit
The audit service allows Tymly to keep a history of change in records. 

If you do not want a model to keep a history of changes then add the flag ```"audit": false``` to it's json definition. Tymly will store this history in the 'rewind' model.

This service will pick up any file in the /pg-scripts directory of a blueprint with the following file naming convention: 
```audit-{function-name}.sql``` where {function-name} is the name of your function.

This function will then be applied to all models by default unless they have ```"audit":false```.
 
### Storage
Keeps storage of relevant blueprint objects and creates them in the database provided at PG_CONNECTION_STRING.

## <a name="test"></a>Testing

Before running these tests, you'll need a test PostgreSQL database available and set a `PG_CONNECTION_STRING` environment variable to point to it, for example:

```PG_CONNECTION_STRING=postgres://postgres:postgres@localhost:5432/my_test_db```

```bash
$ npm test
```

## <a name="license"></a>License

MIT
