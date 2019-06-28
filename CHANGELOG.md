# [1.124.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.123.0...v1.124.0) (2019-06-28)


### 🛠 Builds

* **deps:** Update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.29.0 to 1.31.0 ([bf0f1aa](https://github.com/wmfs/tymly-pg-plugin/commit/bf0f1aa))
* **deps-dev:** Update [@semantic-release](https://github.com/semantic-release)/git requirement ([c71e545](https://github.com/wmfs/tymly-pg-plugin/commit/c71e545))

# [1.123.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.122.0...v1.123.0) (2019-06-26)


### 🛠 Builds

* **deps:** Update async requirement from 2.6.2 to 3.1.0 ([428bb0d](https://github.com/wmfs/tymly-pg-plugin/commit/428bb0d))
* **deps:** Update luxon requirement from 1.12.1 to 1.16.0 ([06abc77](https://github.com/wmfs/tymly-pg-plugin/commit/06abc77))
* **deps-dev:** Update [@semantic-release](https://github.com/semantic-release)/git requirement ([752c524](https://github.com/wmfs/tymly-pg-plugin/commit/752c524))
* **deps-dev:** Update codecov requirement from 3.3.0 to 3.5.0 ([cda732a](https://github.com/wmfs/tymly-pg-plugin/commit/cda732a))
* **deps-dev:** Update mocha requirement from 6.1.2 to 6.1.4 ([a004dd5](https://github.com/wmfs/tymly-pg-plugin/commit/a004dd5))
* **deps-dev:** Update semantic-release requirement ([a88d40b](https://github.com/wmfs/tymly-pg-plugin/commit/a88d40b))

# [1.122.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.121.0...v1.122.0) (2019-04-09)


### 🛠 Builds

* **deps:** Bump pg-model, pg-delta-file, luxon ([f53e7df](https://github.com/wmfs/tymly-pg-plugin/commit/f53e7df))
* **dev-deps:** Bumped mocha and semantic-release/changelog ([b96507c](https://github.com/wmfs/tymly-pg-plugin/commit/b96507c))

# [1.121.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.120.0...v1.121.0) (2019-04-05)


### 🛠 Builds

* **deps:** Update [@wmfs](https://github.com/wmfs)/pg-model requirement from 1.13.0 to 1.14.0 ([4ac73ae](https://github.com/wmfs/tymly-pg-plugin/commit/4ac73ae))

# [1.120.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.119.0...v1.120.0) (2019-04-05)


### 🛠 Builds

* **deps:** Update [@wmfs](https://github.com/wmfs)/pg-diff-sync requirement from 1.13.0 to 1.13.2 ([1926d64](https://github.com/wmfs/tymly-pg-plugin/commit/1926d64))
* **deps-dev:** Update codecov requirement from 3.2.0 to 3.3.0 ([5abc983](https://github.com/wmfs/tymly-pg-plugin/commit/5abc983))

# [1.119.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.118.2...v1.119.0) (2019-04-05)


### 🛠 Builds

* **deps:** Update luxon requirement from 1.11.1 to 1.12.0 ([8ed58b8](https://github.com/wmfs/tymly-pg-plugin/commit/8ed58b8))
* **deps-dev:** Update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.83.1 to 1.92.0 ([64a4f90](https://github.com/wmfs/tymly-pg-plugin/commit/64a4f90))
* **deps-dev:** Update mocha requirement from 5.2.0 to 6.0.2 ([029f080](https://github.com/wmfs/tymly-pg-plugin/commit/029f080))

## [1.118.2](https://github.com/wmfs/tymly-pg-plugin/compare/v1.118.1...v1.118.2) (2019-03-21)


### 🐛 Bug Fixes

* Add parameters schema for AuditTrail state resource. ([ebbbab7](https://github.com/wmfs/tymly-pg-plugin/commit/ebbbab7))

## [1.118.1](https://github.com/wmfs/tymly-pg-plugin/compare/v1.118.0...v1.118.1) (2019-03-06)


### 🐛 Bug Fixes

* **audit-trail:** Formatted logs even more nicely ([a3163ad](https://github.com/wmfs/tymly-pg-plugin/commit/a3163ad))

# [1.118.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.117.1...v1.118.0) (2019-03-05)


### ✨ Features

* **audit-trail:** Return raw or formatted history but not both. Control with "format": "raw" parame ([8638002](https://github.com/wmfs/tymly-pg-plugin/commit/8638002))


### 💎 Styles

* lint ([63cf4f3](https://github.com/wmfs/tymly-pg-plugin/commit/63cf4f3))

## [1.117.1](https://github.com/wmfs/tymly-pg-plugin/compare/v1.117.0...v1.117.1) (2019-03-05)


### 🐛 Bug Fixes

* **auditTrail:** Formatted log now an object, with change, modified, modifiedBy ([4fbe90c](https://github.com/wmfs/tymly-pg-plugin/commit/4fbe90c))

# [1.117.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.116.1...v1.117.0) (2019-03-05)


### ✨ Features

* **audit-trail:** New auditTrail module to grab the edit history of anything in tymly.rewind ([be97864](https://github.com/wmfs/tymly-pg-plugin/commit/be97864))

## [1.116.1](https://github.com/wmfs/tymly-pg-plugin/compare/v1.116.0...v1.116.1) (2019-03-04)


### 🐛 Bug Fixes

* **audit:** Pickup _modified_by from new data ([03c9de2](https://github.com/wmfs/tymly-pg-plugin/commit/03c9de2))

# [1.116.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.115.0...v1.116.0) (2019-03-04)


### ✨ Features

* **audit:** Tymly.Replay captures correct key_string ([b90e08a](https://github.com/wmfs/tymly-pg-plugin/commit/b90e08a))


### 🐛 Bug Fixes

* Generate primary key name array properly. ([59f1e85](https://github.com/wmfs/tymly-pg-plugin/commit/59f1e85))


### 📦 Code Refactoring

* **audit:** Hoist db structure query out of loop for improved boot time ([1e497c9](https://github.com/wmfs/tymly-pg-plugin/commit/1e497c9))


### 🚨 Tests

* **audit:** Check key_string ([3c8cb35](https://github.com/wmfs/tymly-pg-plugin/commit/3c8cb35))


### ♻️ Chores

* **deps:** Bumped async, hl-pg-client, pg-diff-sync, pg-info, pg-model, relationise, supercopy ver ([76f232c](https://github.com/wmfs/tymly-pg-plugin/commit/76f232c))


### 💎 Styles

* Lint fix ([788016d](https://github.com/wmfs/tymly-pg-plugin/commit/788016d))

# [1.115.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.114.0...v1.115.0) (2019-01-29)


### 🛠 Builds

* **deps:** Update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.28.0 to 1.29.0 ([dc40c62](https://github.com/wmfs/tymly-pg-plugin/commit/dc40c62))
* **deps-dev:** Update [@semantic-release](https://github.com/semantic-release)/git requirement ([a3962f3](https://github.com/wmfs/tymly-pg-plugin/commit/a3962f3))
* **deps-dev:** Update semantic-release requirement ([3ee8d98](https://github.com/wmfs/tymly-pg-plugin/commit/3ee8d98))


### 🚨 Tests

* FindById tests, to confirm they work properly with the pg storage service ([5c1dc26](https://github.com/wmfs/tymly-pg-plugin/commit/5c1dc26))


### ⚙️ Continuous Integrations

* **circle:** add circle ci config ([0258ff7](https://github.com/wmfs/tymly-pg-plugin/commit/0258ff7))
* **travis:** update travis config ([4e3dc98](https://github.com/wmfs/tymly-pg-plugin/commit/4e3dc98))


### ♻️ Chores

* Add getNextValueFromSequence Example ([091a796](https://github.com/wmfs/tymly-pg-plugin/commit/091a796))

# [1.114.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.113.0...v1.114.0) (2019-01-08)


### 🛠 Builds

* **deps:** Update debug requirement from 4.1.0 to 4.1.1 ([#288](https://github.com/wmfs/tymly-pg-plugin/issues/288)) ([f00be9c](https://github.com/wmfs/tymly-pg-plugin/commit/f00be9c))
* **deps-dev:** Update rimraf requirement from 2.6.2 to 2.6.3 ([#295](https://github.com/wmfs/tymly-pg-plugin/issues/295)) ([bd0f203](https://github.com/wmfs/tymly-pg-plugin/commit/bd0f203))


### ⚙️ Continuous Integrations

* revert release rule back to 'build' ([226c343](https://github.com/wmfs/tymly-pg-plugin/commit/226c343))

# [1.113.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.112.0...v1.113.0) (2018-12-21)

# [1.112.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.111.1...v1.112.0) (2018-12-21)


### 🚨 Tests

* Tweak day in the life blueprint Parallel task ([98fed59](https://github.com/wmfs/tymly-pg-plugin/commit/98fed59))

## [1.111.1](https://github.com/wmfs/tymly-pg-plugin/compare/v1.111.0...v1.111.1) (2018-12-18)


### 🐛 Bug Fixes

* No-op change to force plugin to release ([06db66a](https://github.com/wmfs/tymly-pg-plugin/commit/06db66a))

# [1.111.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.110.0...v1.111.0) (2018-12-18)


### 🛠 Builds

* **deps:** update boom requirement from 7.2.2 to 7.3.0 ([07fed20](https://github.com/wmfs/tymly-pg-plugin/commit/07fed20))

# [1.110.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.109.0...v1.110.0) (2018-12-18)


### ✨ Features

* Actually commit the file that does the create/update change ([7834a72](https://github.com/wmfs/tymly-pg-plugin/commit/7834a72))

# [1.109.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.108.0...v1.109.0) (2018-12-18)


### ✨ Features

* Apply database creates and database alterations separately. ([4a67415](https://github.com/wmfs/tymly-pg-plugin/commit/4a67415))


### 🐛 Bug Fixes

* Update the right dependency you absolute melt ([8908aec](https://github.com/wmfs/tymly-pg-plugin/commit/8908aec))

# [1.108.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.107.0...v1.108.0) (2018-11-30)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([4af110f](https://github.com/wmfs/tymly-pg-plugin/commit/4af110f))

# [1.107.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.106.0...v1.107.0) (2018-11-30)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.27.0 to 1.27.1 ([37eca7b](https://github.com/wmfs/tymly-pg-plugin/commit/37eca7b))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.64.0 to 1.65.0 ([0acca2a](https://github.com/wmfs/tymly-pg-plugin/commit/0acca2a))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.65.0 to 1.65.1 ([b3f1c17](https://github.com/wmfs/tymly-pg-plugin/commit/b3f1c17))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.65.1 to 1.66.0 ([da3b39f](https://github.com/wmfs/tymly-pg-plugin/commit/da3b39f))

# [1.106.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.105.0...v1.106.0) (2018-11-27)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([f878ce7](https://github.com/wmfs/tymly-pg-plugin/commit/f878ce7))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.63.0 to 1.64.0 ([077f403](https://github.com/wmfs/tymly-pg-plugin/commit/077f403))
* **deps-dev:** update semantic-release requirement ([ef18606](https://github.com/wmfs/tymly-pg-plugin/commit/ef18606))

# [1.105.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.104.0...v1.105.0) (2018-11-23)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([41ad7e4](https://github.com/wmfs/tymly-pg-plugin/commit/41ad7e4))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.60.0 to 1.61.0 ([bcc7a2b](https://github.com/wmfs/tymly-pg-plugin/commit/bcc7a2b))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.61.0 to 1.62.0 ([7e0355b](https://github.com/wmfs/tymly-pg-plugin/commit/7e0355b))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.62.0 to 1.63.0 ([ce5cee3](https://github.com/wmfs/tymly-pg-plugin/commit/ce5cee3))
* **deps-dev:** update semantic-release requirement ([ce79501](https://github.com/wmfs/tymly-pg-plugin/commit/ce79501))

# [1.104.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.103.0...v1.104.0) (2018-11-17)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([7420a92](https://github.com/wmfs/tymly-pg-plugin/commit/7420a92))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.59.0 to 1.60.0 ([2259e0d](https://github.com/wmfs/tymly-pg-plugin/commit/2259e0d))

# [1.103.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.102.0...v1.103.0) (2018-11-15)


### ✨ Features

* allow sequences in blueprint, and getNextVal state resource ([5c617e8](https://github.com/wmfs/tymly-pg-plugin/commit/5c617e8))


### 🛠 Builds

* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.58.0 to 1.59.0 ([c980605](https://github.com/wmfs/tymly-pg-plugin/commit/c980605))
* **deps-dev:** update semantic-release requirement ([f998578](https://github.com/wmfs/tymly-pg-plugin/commit/f998578))
* **deps-dev:** update semantic-release requirement ([de5094d](https://github.com/wmfs/tymly-pg-plugin/commit/de5094d))

# [1.102.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.101.0...v1.102.0) (2018-11-10)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([4d8d7d9](https://github.com/wmfs/tymly-pg-plugin/commit/4d8d7d9))

# [1.101.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.100.0...v1.101.0) (2018-11-10)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([526f2cd](https://github.com/wmfs/tymly-pg-plugin/commit/526f2cd))

# [1.100.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.99.0...v1.100.0) (2018-11-10)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([f384585](https://github.com/wmfs/tymly-pg-plugin/commit/f384585))

# [1.99.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.98.0...v1.99.0) (2018-11-07)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/hl-pg-client requirement from 1.8.0 to 1.9.0 ([402700e](https://github.com/wmfs/tymly-pg-plugin/commit/402700e))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.25.0 to 1.27.0 ([c0dfa47](https://github.com/wmfs/tymly-pg-plugin/commit/c0dfa47))

# [1.98.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.97.0...v1.98.0) (2018-11-07)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([ca884e1](https://github.com/wmfs/tymly-pg-plugin/commit/ca884e1))
* **deps:** update [@wmfs](https://github.com/wmfs)/supercopy requirement from 1.11.0 to 1.12.0 ([304ab9b](https://github.com/wmfs/tymly-pg-plugin/commit/304ab9b))
* **deps-dev:** update semantic-release requirement ([1faece8](https://github.com/wmfs/tymly-pg-plugin/commit/1faece8))

# [1.97.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.96.0...v1.97.0) (2018-11-04)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([f586b14](https://github.com/wmfs/tymly-pg-plugin/commit/f586b14))

# [1.96.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.95.0...v1.96.0) (2018-11-03)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([b69101c](https://github.com/wmfs/tymly-pg-plugin/commit/b69101c))

# [1.95.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.94.0...v1.95.0) (2018-11-03)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-model requirement from 1.10.0 to 1.11.0 ([610d899](https://github.com/wmfs/tymly-pg-plugin/commit/610d899))

# [1.94.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.93.0...v1.94.0) (2018-11-03)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.24.0 to 1.25.0 ([2ff3414](https://github.com/wmfs/tymly-pg-plugin/commit/2ff3414))

# [1.93.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.92.0...v1.93.0) (2018-11-03)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-diff-sync requirement from 1.8.0 to 1.9.0 ([cbbaf72](https://github.com/wmfs/tymly-pg-plugin/commit/cbbaf72))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-info requirement from 1.8.0 to 1.9.0 ([1d7a426](https://github.com/wmfs/tymly-pg-plugin/commit/1d7a426))
* **deps:** update [@wmfs](https://github.com/wmfs)/relationize requirement from 1.9.0 to 1.10.0 ([59e026f](https://github.com/wmfs/tymly-pg-plugin/commit/59e026f))
* **deps:** update [@wmfs](https://github.com/wmfs)/supercopy requirement from 1.10.0 to 1.11.0 ([da83f9c](https://github.com/wmfs/tymly-pg-plugin/commit/da83f9c))

# [1.92.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.91.0...v1.92.0) (2018-11-03)


### 🛠 Builds

* **deps:** update boom requirement from 7.2.1 to 7.2.2 ([0cc3a94](https://github.com/wmfs/tymly-pg-plugin/commit/0cc3a94))
* **deps-dev:** update semantic-release requirement ([d70802b](https://github.com/wmfs/tymly-pg-plugin/commit/d70802b))

# [1.91.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.90.0...v1.91.0) (2018-11-01)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-model requirement from 1.9.0 to 1.10.0 ([5c12055](https://github.com/wmfs/tymly-pg-plugin/commit/5c12055))

# [1.90.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.89.0...v1.90.0) (2018-11-01)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.23.0 to 1.24.0 ([0c2600e](https://github.com/wmfs/tymly-pg-plugin/commit/0c2600e))

# [1.89.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.88.0...v1.89.0) (2018-11-01)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-diff-sync requirement from 1.7.0 to 1.8.0 ([b63d9c4](https://github.com/wmfs/tymly-pg-plugin/commit/b63d9c4))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-info requirement from 1.7.0 to 1.8.0 ([3188221](https://github.com/wmfs/tymly-pg-plugin/commit/3188221))
* **deps:** update [@wmfs](https://github.com/wmfs)/relationize requirement from 1.8.0 to 1.9.0 ([c4b4214](https://github.com/wmfs/tymly-pg-plugin/commit/c4b4214))
* **deps:** update [@wmfs](https://github.com/wmfs)/supercopy requirement from 1.9.0 to 1.10.0 ([c19408f](https://github.com/wmfs/tymly-pg-plugin/commit/c19408f))

# [1.88.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.87.0...v1.88.0) (2018-11-01)


### 🛠 Builds

* **deps:** update boom requirement from 7.2.0 to 7.2.1 ([ba3e3d7](https://github.com/wmfs/tymly-pg-plugin/commit/ba3e3d7))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.56.0 to 1.57.0 ([e7ce4b7](https://github.com/wmfs/tymly-pg-plugin/commit/e7ce4b7))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.57.0 to 1.58.0 ([ef0e852](https://github.com/wmfs/tymly-pg-plugin/commit/ef0e852))

# [1.87.0](https://github.com/wmfs/tymly-pg-plugin.git/compare/v1.86.0...v1.87.0) (2018-10-31)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([fa6e42b](https://github.com/wmfs/tymly-pg-plugin.git/commit/fa6e42b))
* **deps-dev:** update semantic-release requirement ([c1de433](https://github.com/wmfs/tymly-pg-plugin.git/commit/c1de433))

# [1.86.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.85.0...v1.86.0) (2018-10-26)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.22.0 to 1.23.0 ([9004696](https://github.com/wmfs/tymly-pg-plugin/commit/9004696))

# [1.85.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.84.0...v1.85.0) (2018-10-26)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([22650b3](https://github.com/wmfs/tymly-pg-plugin/commit/22650b3))
* **deps:** update [@wmfs](https://github.com/wmfs)/supercopy requirement from 1.8.0 to 1.9.0 ([746dc1c](https://github.com/wmfs/tymly-pg-plugin/commit/746dc1c))

# [1.84.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.83.0...v1.84.0) (2018-10-26)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/hl-pg-client requirement from 1.7.0 to 1.8.0 ([8dc2431](https://github.com/wmfs/tymly-pg-plugin/commit/8dc2431))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.21.0 to 1.22.0 ([0744fb0](https://github.com/wmfs/tymly-pg-plugin/commit/0744fb0))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.54.0 to 1.55.0 ([eed9b6b](https://github.com/wmfs/tymly-pg-plugin/commit/eed9b6b))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.55.0 to 1.56.0 ([33c08b2](https://github.com/wmfs/tymly-pg-plugin/commit/33c08b2))

# [1.83.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.82.0...v1.83.0) (2018-10-23)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-diff-sync requirement from 1.6.0 to 1.7.0 ([93d9d79](https://github.com/wmfs/tymly-pg-plugin/commit/93d9d79))

# [1.82.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.81.0...v1.82.0) (2018-10-23)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-model requirement from 1.8.0 to 1.9.0 ([95ae960](https://github.com/wmfs/tymly-pg-plugin/commit/95ae960))

# [1.81.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.80.0...v1.81.0) (2018-10-23)


### 🛠 Builds

* **deps:** update dottie requirement from 2.0.0 to 2.0.1 ([6a546fd](https://github.com/wmfs/tymly-pg-plugin/commit/6a546fd))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.51.0 to 1.52.0 ([476e192](https://github.com/wmfs/tymly-pg-plugin/commit/476e192))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.52.0 to 1.52.1 ([a55cd6a](https://github.com/wmfs/tymly-pg-plugin/commit/a55cd6a))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.52.1 to 1.53.0 ([57c411c](https://github.com/wmfs/tymly-pg-plugin/commit/57c411c))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.53.0 to 1.54.0 ([ca9c79d](https://github.com/wmfs/tymly-pg-plugin/commit/ca9c79d))
* **deps-dev:** update semantic-release requirement ([064653c](https://github.com/wmfs/tymly-pg-plugin/commit/064653c))
* **deps-dev:** update semantic-release requirement ([02624dd](https://github.com/wmfs/tymly-pg-plugin/commit/02624dd))

# [1.80.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.79.0...v1.80.0) (2018-10-19)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([7390c64](https://github.com/wmfs/tymly-pg-plugin/commit/7390c64))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/changelog requirement ([eef26f2](https://github.com/wmfs/tymly-pg-plugin/commit/eef26f2))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement ([8651d6f](https://github.com/wmfs/tymly-pg-plugin/commit/8651d6f))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.48.1 to 1.49.0 ([33198fc](https://github.com/wmfs/tymly-pg-plugin/commit/33198fc))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.49.0 to 1.50.0 ([b9ad825](https://github.com/wmfs/tymly-pg-plugin/commit/b9ad825))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.50.0 to 1.51.0 ([587e5d9](https://github.com/wmfs/tymly-pg-plugin/commit/587e5d9))
* **deps-dev:** update semantic-release requirement ([6e806bb](https://github.com/wmfs/tymly-pg-plugin/commit/6e806bb))

# [1.79.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.78.0...v1.79.0) (2018-10-16)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.20.0 to 1.21.0 ([761be89](https://github.com/wmfs/tymly-pg-plugin/commit/761be89))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.45.0 to 1.46.0 ([b12d184](https://github.com/wmfs/tymly-pg-plugin/commit/b12d184))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.46.0 to 1.47.0 ([ca8358f](https://github.com/wmfs/tymly-pg-plugin/commit/ca8358f))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.47.0 to 1.48.0 ([14fbf52](https://github.com/wmfs/tymly-pg-plugin/commit/14fbf52))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.48.0 to 1.48.1 ([ddffef6](https://github.com/wmfs/tymly-pg-plugin/commit/ddffef6))
* **deps-dev:** update nyc requirement from 13.0.1 to 13.1.0 ([81dbbef](https://github.com/wmfs/tymly-pg-plugin/commit/81dbbef))

# [1.78.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.77.0...v1.78.0) (2018-10-08)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.18.0 to 1.20.0 ([ce591cf](https://github.com/wmfs/tymly-pg-plugin/commit/ce591cf))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.44.0 to 1.45.0 ([7690350](https://github.com/wmfs/tymly-pg-plugin/commit/7690350))

# [1.77.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.76.0...v1.77.0) (2018-10-08)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-info requirement from 1.6.0 to 1.7.0 ([1cd8a12](https://github.com/wmfs/tymly-pg-plugin/commit/1cd8a12))

# [1.76.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.75.0...v1.76.0) (2018-10-08)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/hl-pg-client requirement from 1.5.0 to 1.7.0 ([9510ee6](https://github.com/wmfs/tymly-pg-plugin/commit/9510ee6))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([4ad5054](https://github.com/wmfs/tymly-pg-plugin/commit/4ad5054))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-diff-sync requirement from 1.5.0 to 1.6.0 ([b0c4a76](https://github.com/wmfs/tymly-pg-plugin/commit/b0c4a76))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-model requirement from 1.7.0 to 1.8.0 ([8fa9e7c](https://github.com/wmfs/tymly-pg-plugin/commit/8fa9e7c))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.17.0 to 1.18.0 ([6261291](https://github.com/wmfs/tymly-pg-plugin/commit/6261291))
* **deps:** update [@wmfs](https://github.com/wmfs)/relationize requirement from 1.7.0 to 1.8.0 ([c059bb4](https://github.com/wmfs/tymly-pg-plugin/commit/c059bb4))
* **deps:** update [@wmfs](https://github.com/wmfs)/supercopy requirement from 1.7.0 to 1.8.0 ([fada7fc](https://github.com/wmfs/tymly-pg-plugin/commit/fada7fc))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.42.0 to 1.43.0 ([4893957](https://github.com/wmfs/tymly-pg-plugin/commit/4893957))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.43.0 to 1.44.0 ([2b18da7](https://github.com/wmfs/tymly-pg-plugin/commit/2b18da7))

# [1.75.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.74.0...v1.75.0) (2018-10-08)


### 🛠 Builds

* **deps:** update debug requirement from 4.0.1 to 4.1.0 ([3665b39](https://github.com/wmfs/tymly-pg-plugin/commit/3665b39))

# [1.74.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.73.0...v1.74.0) (2018-10-04)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([eba7c85](https://github.com/wmfs/tymly-pg-plugin/commit/eba7c85))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.41.0 to 1.42.0 ([3993582](https://github.com/wmfs/tymly-pg-plugin/commit/3993582))
* **deps-dev:** update semantic-release requirement ([537855a](https://github.com/wmfs/tymly-pg-plugin/commit/537855a))

# [1.73.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.72.0...v1.73.0) (2018-10-03)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.16.0 to 1.17.0 ([e05a396](https://github.com/wmfs/tymly-pg-plugin/commit/e05a396))

# [1.72.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.71.0...v1.72.0) (2018-10-03)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.15.0 to 1.16.0 ([edb272b](https://github.com/wmfs/tymly-pg-plugin/commit/edb272b))

# [1.71.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.70.0...v1.71.0) (2018-10-03)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement ([a31c77d](https://github.com/wmfs/tymly-pg-plugin/commit/a31c77d))
* **deps:** update [@wmfs](https://github.com/wmfs)/supercopy requirement from 1.6.0 to 1.7.0 ([cd9d35a](https://github.com/wmfs/tymly-pg-plugin/commit/cd9d35a))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.39.0 to 1.40.0 ([cbc4e9e](https://github.com/wmfs/tymly-pg-plugin/commit/cbc4e9e))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.40.0 to 1.41.0 ([c77df55](https://github.com/wmfs/tymly-pg-plugin/commit/c77df55))

# [1.70.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.69.0...v1.70.0) (2018-10-01)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement from 1.9.0 to 1.10.0 ([62b70d5](https://github.com/wmfs/tymly-pg-plugin/commit/62b70d5))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.37.0 to 1.39.0 ([d9d6b4b](https://github.com/wmfs/tymly-pg-plugin/commit/d9d6b4b))

# [1.69.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.68.0...v1.69.0) (2018-09-28)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement from 1.8.0 to 1.9.0 ([894528d](https://github.com/wmfs/tymly-pg-plugin/commit/894528d))

# [1.68.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.67.0...v1.68.0) (2018-09-28)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement from 1.7.0 to 1.8.0 ([e5d9446](https://github.com/wmfs/tymly-pg-plugin/commit/e5d9446))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.31.0 to 1.32.0 ([17c8e33](https://github.com/wmfs/tymly-pg-plugin/commit/17c8e33))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.32.0 to 1.33.0 ([aaf0d87](https://github.com/wmfs/tymly-pg-plugin/commit/aaf0d87))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.33.0 to 1.34.0 ([d63f842](https://github.com/wmfs/tymly-pg-plugin/commit/d63f842))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.34.0 to 1.35.0 ([55d7c07](https://github.com/wmfs/tymly-pg-plugin/commit/55d7c07))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.35.0 to 1.36.0 ([fc1a593](https://github.com/wmfs/tymly-pg-plugin/commit/fc1a593))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.36.0 to 1.37.0 ([bb0b638](https://github.com/wmfs/tymly-pg-plugin/commit/bb0b638))
* **deps-dev:** update chai requirement from 4.1.2 to 4.2.0 ([f6a1caa](https://github.com/wmfs/tymly-pg-plugin/commit/f6a1caa))
* **deps-dev:** update semantic-release requirement ([f746511](https://github.com/wmfs/tymly-pg-plugin/commit/f746511))

# [1.67.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.66.0...v1.67.0) (2018-09-13)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/supercopy requirement from 1.5.0 to 1.6.0 ([badb6bf](https://github.com/wmfs/tymly-pg-plugin/commit/badb6bf))

# [1.66.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.65.0...v1.66.0) (2018-09-12)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-info requirement from 1.5.0 to 1.6.0 ([a86b27f](https://github.com/wmfs/tymly-pg-plugin/commit/a86b27f))

# [1.65.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.64.0...v1.65.0) (2018-09-12)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-model requirement from 1.6.0 to 1.7.0 ([08a1ea6](https://github.com/wmfs/tymly-pg-plugin/commit/08a1ea6))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.30.0 to 1.31.0 ([2827093](https://github.com/wmfs/tymly-pg-plugin/commit/2827093))

# [1.64.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.63.0...v1.64.0) (2018-09-12)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement from 1.6.0 to 1.7.0 ([81d6372](https://github.com/wmfs/tymly-pg-plugin/commit/81d6372))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-diff-sync requirement from 1.4.0 to 1.5.0 ([4a98b10](https://github.com/wmfs/tymly-pg-plugin/commit/4a98b10))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.14.0 to 1.15.0 ([d89d73f](https://github.com/wmfs/tymly-pg-plugin/commit/d89d73f))
* **deps:** update [@wmfs](https://github.com/wmfs)/relationize requirement from 1.6.0 to 1.7.0 ([4aee5fc](https://github.com/wmfs/tymly-pg-plugin/commit/4aee5fc))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.29.0 to 1.30.0 ([f1a8afd](https://github.com/wmfs/tymly-pg-plugin/commit/f1a8afd))

# [1.63.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.62.0...v1.63.0) (2018-09-12)


### 🛠 Builds

* **deps:** update lodash requirement from 4.17.10 to 4.17.11 ([6edef49](https://github.com/wmfs/tymly-pg-plugin/commit/6edef49))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.26.1 to 1.27.0 ([5ee29b3](https://github.com/wmfs/tymly-pg-plugin/commit/5ee29b3))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.27.0 to 1.29.0 ([a87df84](https://github.com/wmfs/tymly-pg-plugin/commit/a87df84))

# [1.62.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.61.0...v1.62.0) (2018-09-12)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.13.0 to 1.14.0 ([35dba6f](https://github.com/wmfs/tymly-pg-plugin/commit/35dba6f))

# [1.61.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.60.0...v1.61.0) (2018-09-12)


### 🛠 Builds

* **deps:** update debug requirement from 4.0.0 to 4.0.1 ([3a5ade4](https://github.com/wmfs/tymly-pg-plugin/commit/3a5ade4))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement ([af7faed](https://github.com/wmfs/tymly-pg-plugin/commit/af7faed))
* **deps-dev:** update semantic-release requirement ([b9c2348](https://github.com/wmfs/tymly-pg-plugin/commit/b9c2348))

# [1.60.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.59.0...v1.60.0) (2018-09-12)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-info requirement from 1.3.0 to 1.5.0 ([9b23072](https://github.com/wmfs/tymly-pg-plugin/commit/9b23072))

# [1.59.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.58.0...v1.59.0) (2018-09-12)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.12.0 to 1.13.0 ([e87359f](https://github.com/wmfs/tymly-pg-plugin/commit/e87359f))

# [1.58.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.57.0...v1.58.0) (2018-09-12)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/hl-pg-client requirement from 1.4.0 to 1.5.0 ([2af3262](https://github.com/wmfs/tymly-pg-plugin/commit/2af3262))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-diff-sync requirement from 1.2.0 to 1.4.0 ([f97ed23](https://github.com/wmfs/tymly-pg-plugin/commit/f97ed23))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-model requirement from 1.5.0 to 1.6.0 ([a51e862](https://github.com/wmfs/tymly-pg-plugin/commit/a51e862))
* **deps:** update [@wmfs](https://github.com/wmfs)/relationize requirement from 1.5.0 to 1.6.0 ([8bef550](https://github.com/wmfs/tymly-pg-plugin/commit/8bef550))

# [1.57.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.56.0...v1.57.0) (2018-09-11)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.9.0 to 1.12.0 ([d3e4af5](https://github.com/wmfs/tymly-pg-plugin/commit/d3e4af5))

# [1.56.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.55.0...v1.56.0) (2018-09-11)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement from 1.5.0 to 1.6.0 ([8d3bb4c](https://github.com/wmfs/tymly-pg-plugin/commit/8d3bb4c))

# [1.55.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.54.0...v1.55.0) (2018-09-11)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/relationize requirement from 1.3.0 to 1.5.0 ([c7a022c](https://github.com/wmfs/tymly-pg-plugin/commit/c7a022c))

# [1.54.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.53.0...v1.54.0) (2018-09-11)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-diff-sync requirement from 1.1.0 to 1.3.0 ([c456b5d](https://github.com/wmfs/tymly-pg-plugin/commit/c456b5d))
* **deps:** update [@wmfs](https://github.com/wmfs)/supercopy requirement from 1.4.0 to 1.5.0 ([f7e4130](https://github.com/wmfs/tymly-pg-plugin/commit/f7e4130))

# [1.53.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.52.0...v1.53.0) (2018-09-11)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/hl-pg-client requirement from 1.2.0 to 1.4.0 ([52d7221](https://github.com/wmfs/tymly-pg-plugin/commit/52d7221))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-model requirement from 1.2.0 to 1.5.0 ([cc4461e](https://github.com/wmfs/tymly-pg-plugin/commit/cc4461e))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.8.0 to 1.9.0 ([bbebc94](https://github.com/wmfs/tymly-pg-plugin/commit/bbebc94))

# [1.52.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.51.0...v1.52.0) (2018-09-11)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-diff-sync requirement from 1.0.0 to 1.1.0 ([4e53bc7](https://github.com/wmfs/tymly-pg-plugin/commit/4e53bc7))
* **deps:** update [@wmfs](https://github.com/wmfs)/pg-info requirement from 1.1.0 to 1.3.0 ([b727424](https://github.com/wmfs/tymly-pg-plugin/commit/b727424))
* **deps:** update [@wmfs](https://github.com/wmfs)/supercopy requirement from 1.2.0 to 1.3.0 ([cfa50e7](https://github.com/wmfs/tymly-pg-plugin/commit/cfa50e7))
* **deps:** update [@wmfs](https://github.com/wmfs)/supercopy requirement from 1.3.0 to 1.4.0 ([df60033](https://github.com/wmfs/tymly-pg-plugin/commit/df60033))
* **deps:** update debug requirement from 3.2.1 to 3.2.3 ([fad46c8](https://github.com/wmfs/tymly-pg-plugin/commit/fad46c8))
* **deps:** update debug requirement from 3.2.3 to 4.0.0 ([6013fb6](https://github.com/wmfs/tymly-pg-plugin/commit/6013fb6))

# [1.51.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.50.0...v1.51.0) (2018-09-11)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-model requirement from 1.1.2 to 1.2.0 ([1642cb8](https://github.com/wmfs/tymly-pg-plugin/commit/1642cb8))
* **deps:** update debug requirement from 3.2.0 to 3.2.1 ([49c28e7](https://github.com/wmfs/tymly-pg-plugin/commit/49c28e7))

# [1.50.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.49.0...v1.50.0) (2018-09-11)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/relationize requirement from 1.2.0 to 1.3.0 ([7987fc1](https://github.com/wmfs/tymly-pg-plugin/commit/7987fc1))

# [1.49.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.48.0...v1.49.0) (2018-09-11)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/hl-pg-client requirement from 1.1.3 to 1.2.0 ([a6e59d9](https://github.com/wmfs/tymly-pg-plugin/commit/a6e59d9))

# [1.48.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.47.0...v1.48.0) (2018-09-11)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.7.0 to 1.8.0 ([270805c](https://github.com/wmfs/tymly-pg-plugin/commit/270805c))

# [1.47.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.46.0...v1.47.0) (2018-09-11)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-info requirement from 1.0.2 to 1.1.0 ([4820ea2](https://github.com/wmfs/tymly-pg-plugin/commit/4820ea2))

# [1.46.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.45.0...v1.46.0) (2018-09-11)


### 🛠 Builds

* **deps:** update debug requirement from 3.1.0 to 3.2.0 ([6c3404c](https://github.com/wmfs/tymly-pg-plugin/commit/6c3404c))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.23.0 to 1.24.0 ([242859e](https://github.com/wmfs/tymly-pg-plugin/commit/242859e))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.24.0 to 1.26.0 ([fe803fe](https://github.com/wmfs/tymly-pg-plugin/commit/fe803fe))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.26.0 to 1.26.1 ([b8f6377](https://github.com/wmfs/tymly-pg-plugin/commit/b8f6377))

# [1.45.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.44.0...v1.45.0) (2018-09-08)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/relationize requirement from 1.1.0 to 1.2.0 ([dc59189](https://github.com/wmfs/tymly-pg-plugin/commit/dc59189))
* **deps-dev:** update semantic-release requirement ([ff62ffb](https://github.com/wmfs/tymly-pg-plugin/commit/ff62ffb))

# [1.44.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.43.0...v1.44.0) (2018-09-06)


### 🛠 Builds

* **deps:** [@wmfs](https://github.com/wmfs)/tymly should be a dev-dependency, not a dependency ([92cb0c4](https://github.com/wmfs/tymly-pg-plugin/commit/92cb0c4))
* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.22.0 to 1.23.0 ([a6c19cd](https://github.com/wmfs/tymly-pg-plugin/commit/a6c19cd))

# [1.43.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.42.0...v1.43.0) (2018-09-06)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.21.0 to 1.22.0 ([4457671](https://github.com/wmfs/tymly-pg-plugin/commit/4457671))

# [1.42.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.41.0...v1.42.0) (2018-09-05)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-model requirement from 1.1.1 to 1.1.2 ([deb43ed](https://github.com/wmfs/tymly-pg-plugin/commit/deb43ed))

# [1.41.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.40.0...v1.41.0) (2018-09-05)


### ✨ Features

* Add filterFunctionName to deltaFile options ([b08e952](https://github.com/wmfs/tymly-pg-plugin/commit/b08e952))

# [1.40.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.39.0...v1.40.0) (2018-09-05)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement from 1.4.0 to 1.5.0 ([6d0e1ee](https://github.com/wmfs/tymly-pg-plugin/commit/6d0e1ee))
* **dev-deps:** move to standard 12.0.1 ([bc306f9](https://github.com/wmfs/tymly-pg-plugin/commit/bc306f9))

# [1.39.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.38.0...v1.39.0) (2018-09-05)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.6.0 to 1.7.0 ([b5f20f8](https://github.com/wmfs/tymly-pg-plugin/commit/b5f20f8))

# [1.38.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.37.0...v1.38.0) (2018-09-04)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/supercopy requirement from 1.1.0 to 1.2.0 ([397368e](https://github.com/wmfs/tymly-pg-plugin/commit/397368e))
* **deps-dev:** update codecov requirement from 3.0.4 to 3.1.0 ([cc73836](https://github.com/wmfs/tymly-pg-plugin/commit/cc73836))

# [1.37.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.36.0...v1.37.0) (2018-09-04)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.20.0 to 1.21.0 ([b313fe4](https://github.com/wmfs/tymly-pg-plugin/commit/b313fe4))

# [1.36.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.35.0...v1.36.0) (2018-09-04)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.19.0 to 1.20.0 ([bdef057](https://github.com/wmfs/tymly-pg-plugin/commit/bdef057))

# [1.35.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.34.0...v1.35.0) (2018-09-03)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.17.0 to 1.19.0 ([37ad126](https://github.com/wmfs/tymly-pg-plugin/commit/37ad126))

# [1.34.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.33.0...v1.34.0) (2018-08-30)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.5.0 to 1.6.0 ([29daa91](https://github.com/wmfs/tymly-pg-plugin/commit/29daa91))

# [1.33.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.32.0...v1.33.0) (2018-08-30)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/supercopy requirement from 1.0.2 to 1.1.0 ([1e4fb0c](https://github.com/wmfs/tymly-pg-plugin/commit/1e4fb0c))

# [1.32.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.31.0...v1.32.0) (2018-08-30)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement from 1.4.0 to 1.5.0 ([9ff029f](https://github.com/wmfs/tymly-pg-plugin/commit/9ff029f))
* **deps-dev:** update nyc requirement from 12.0.2 to 13.0.1 ([6bf0f50](https://github.com/wmfs/tymly-pg-plugin/commit/6bf0f50))
* **deps-dev:** update semantic-release requirement from 15.9.11 to 15.9.12 ([59ff453](https://github.com/wmfs/tymly-pg-plugin/commit/59ff453))

# [1.31.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.30.0...v1.31.0) (2018-08-27)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/relationize requirement from 1.0.1 to 1.1.0 ([70fd978](https://github.com/wmfs/tymly-pg-plugin/commit/70fd978))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement from 7.0.1 to 7.0.2 ([209413a](https://github.com/wmfs/tymly-pg-plugin/commit/209413a))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement from 7.0.2 to 7.0.3 ([708f12a](https://github.com/wmfs/tymly-pg-plugin/commit/708f12a))
* **deps-dev:** update semantic-release requirement from 15.9.9 to 15.9.11 ([d534221](https://github.com/wmfs/tymly-pg-plugin/commit/d534221))

# [1.30.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.29.0...v1.30.0) (2018-08-23)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.16.2 to 1.17.0 ([d6d2fd5](https://github.com/wmfs/tymly-pg-plugin/commit/d6d2fd5))

# [1.29.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.28.0...v1.29.0) (2018-08-22)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.16.1 to 1.16.2 ([e99ee85](https://github.com/wmfs/tymly-pg-plugin/commit/e99ee85))
* **deps-dev:** update semantic-release requirement from 15.9.8 to 15.9.9 ([5584d46](https://github.com/wmfs/tymly-pg-plugin/commit/5584d46))

# [1.28.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.27.0...v1.28.0) (2018-08-14)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement from 1.3.0 to 1.4.0 ([c8c7f3e](https://github.com/wmfs/tymly-pg-plugin/commit/c8c7f3e))

# [1.27.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.26.0...v1.27.0) (2018-08-14)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement from 1.2.0 to 1.3.0 ([c2b3672](https://github.com/wmfs/tymly-pg-plugin/commit/c2b3672))

# [1.26.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.25.0...v1.26.0) (2018-08-14)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.16.0 to 1.16.1 ([c0954c1](https://github.com/wmfs/tymly-pg-plugin/commit/c0954c1))

# [1.25.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.24.1...v1.25.0) (2018-08-13)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.15.2 to 1.16.0 ([66eb197](https://github.com/wmfs/tymly-pg-plugin/commit/66eb197))

## [1.24.1](https://github.com/wmfs/tymly-pg-plugin/compare/v1.24.0...v1.24.1) (2018-08-13)


### 🐛 Bug Fixes

* **tests:** reorder test expectations ([a04f554](https://github.com/wmfs/tymly-pg-plugin/commit/a04f554))


### 🛠 Builds

* **deps-dev:** update semantic-release requirement from 15.9.6 to 15.9.7 ([95fabf2](https://github.com/wmfs/tymly-pg-plugin/commit/95fabf2))
* **deps-dev:** update semantic-release requirement from 15.9.7 to 15.9.8 ([c470297](https://github.com/wmfs/tymly-pg-plugin/commit/c470297))


### 🚨 Tests

* edit tests to satisfy difference in OS ([05aa8ae](https://github.com/wmfs/tymly-pg-plugin/commit/05aa8ae))
* standard fix ([9580eab](https://github.com/wmfs/tymly-pg-plugin/commit/9580eab))
* standard fix ([464031e](https://github.com/wmfs/tymly-pg-plugin/commit/464031e))

# [1.24.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.23.0...v1.24.0) (2018-08-09)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.15.1 to 1.15.2 ([db4079a](https://github.com/wmfs/tymly-pg-plugin/commit/db4079a))
* **deps-dev:** update semantic-release requirement from 15.9.5 to 15.9.6 ([98de693](https://github.com/wmfs/tymly-pg-plugin/commit/98de693))

# [1.23.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.22.0...v1.23.0) (2018-08-08)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.15.0 to 1.15.1 ([13c1bb3](https://github.com/wmfs/tymly-pg-plugin/commit/13c1bb3))

# [1.22.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.21.0...v1.22.0) (2018-08-06)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.14.0 to 1.15.0 ([e6824d4](https://github.com/wmfs/tymly-pg-plugin/commit/e6824d4))
* **deps-dev:** update semantic-release requirement from 15.9.3 to 15.9.5 ([cbd034b](https://github.com/wmfs/tymly-pg-plugin/commit/cbd034b))
* **deps-dev:** update semantic-release requirement to 15.9.3 ([57894f4](https://github.com/wmfs/tymly-pg-plugin/commit/57894f4))

# [1.21.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.20.0...v1.21.0) (2018-07-31)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement to 1.4.0 ([84f4b5a](https://github.com/wmfs/tymly-pg-plugin/commit/84f4b5a))

# [1.20.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.19.0...v1.20.0) (2018-07-31)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.14.0 ([7954271](https://github.com/wmfs/tymly-pg-plugin/commit/7954271))

# [1.19.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.18.0...v1.19.0) (2018-07-31)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-telepods requirement to 1.3.0 ([ed05799](https://github.com/wmfs/tymly-pg-plugin/commit/ed05799))
* **deps-dev:** update semantic-release requirement to 15.9.2 ([c27a336](https://github.com/wmfs/tymly-pg-plugin/commit/c27a336))


### 📦 Code Refactoring

* Switch from passing a callback into telepods to using the promise it returns ([ad7d3ac](https://github.com/wmfs/tymly-pg-plugin/commit/ad7d3ac))

# [1.18.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.17.0...v1.18.0) (2018-07-30)


### ✨ Features

* Link up currentUser hook into pg-model ([755b741](https://github.com/wmfs/tymly-pg-plugin/commit/755b741))


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-model requirement to 1.1.1 ([7992cc6](https://github.com/wmfs/tymly-pg-plugin/commit/7992cc6))


### 🚨 Tests

* Added describes ([d2efba4](https://github.com/wmfs/tymly-pg-plugin/commit/d2efba4))
* Added tests for setCurrentUser ([e146733](https://github.com/wmfs/tymly-pg-plugin/commit/e146733))


### 💎 Styles

* Standards fix ([a7f99a0](https://github.com/wmfs/tymly-pg-plugin/commit/a7f99a0))

# [1.17.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.16.0...v1.17.0) (2018-07-27)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.13.0 ([84fc2e3](https://github.com/wmfs/tymly-pg-plugin/commit/84fc2e3))

# [1.16.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.15.0...v1.16.0) (2018-07-27)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.12.1 ([193c91e](https://github.com/wmfs/tymly-pg-plugin/commit/193c91e))

# [1.15.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.14.0...v1.15.0) (2018-07-26)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.12.0 ([0ea568c](https://github.com/wmfs/tymly-pg-plugin/commit/0ea568c))

# [1.14.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.13.0...v1.14.0) (2018-07-25)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/pg-delta-file requirement to 1.2.0 ([dc4d9cc](https://github.com/wmfs/tymly-pg-plugin/commit/dc4d9cc))

# [1.13.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.12.0...v1.13.0) (2018-07-19)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.11.0 ([316c807](https://github.com/wmfs/tymly-pg-plugin/commit/316c807))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/changelog requirement to 2.1.2 ([89f6081](https://github.com/wmfs/tymly-pg-plugin/commit/89f6081))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/changelog requirement to 3.0.0 ([29717d1](https://github.com/wmfs/tymly-pg-plugin/commit/29717d1))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement to 6.0.2 ([d9d8e8f](https://github.com/wmfs/tymly-pg-plugin/commit/d9d8e8f))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement to 7.0.0 ([9af4714](https://github.com/wmfs/tymly-pg-plugin/commit/9af4714))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement to 7.0.1 ([7474df5](https://github.com/wmfs/tymly-pg-plugin/commit/7474df5))
* **deps-dev:** update semantic-release requirement to 15.8.0 ([6511f41](https://github.com/wmfs/tymly-pg-plugin/commit/6511f41))
* **deps-dev:** update semantic-release requirement to 15.8.1 ([83fb42f](https://github.com/wmfs/tymly-pg-plugin/commit/83fb42f))

# [1.12.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.11.0...v1.12.0) (2018-07-16)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.10.0 ([06cca59](https://github.com/wmfs/tymly-pg-plugin/commit/06cca59))
* **deps-dev:** update semantic-release requirement to 15.7.2 ([7155d27](https://github.com/wmfs/tymly-pg-plugin/commit/7155d27))

# [1.11.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.10.0...v1.11.0) (2018-07-15)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.9.0 ([3d178db](https://github.com/wmfs/tymly-pg-plugin/commit/3d178db))

# [1.10.0](https://github.com/wmfs/tymly-pg-plugin/compare/v1.9.0...v1.10.0) (2018-07-13)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.8.0 ([0e49a07](https://github.com/wmfs/tymly-pg-plugin/commit/0e49a07))
* **deps-dev:** update devDeps ([7e5e361](https://github.com/wmfs/tymly-pg-plugin/commit/7e5e361))


### ⚙️ Continuous Integrations

* remove deps-dev scoping release ([4900630](https://github.com/wmfs/tymly-pg-plugin/commit/4900630))
* **semantic-release:** update config ([c3da0c8](https://github.com/wmfs/tymly-pg-plugin/commit/c3da0c8))
