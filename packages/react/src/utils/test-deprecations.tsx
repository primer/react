import semver from 'semver'
import {Deprecations} from './deprecate'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ourVersion = require('../../package.json').version

beforeEach(() => {
  Deprecations.clearDeprecations()
})

afterEach(() => {
  const deprecations = Deprecations.getDeprecations()

  for (const dep of deprecations) {
    if (semver.gte(ourVersion, dep.version)) {
      throw new Error(`Found a deprecation that should be removed in ${dep.version}`)
    }
  }
})
