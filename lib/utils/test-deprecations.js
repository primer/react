'use strict';

var semver = require('semver');
var deprecate = require('./deprecate.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var semver__default = /*#__PURE__*/_interopDefaultLegacy(semver);

const ourVersion = require('../../package.json').version;

beforeEach(() => {
  deprecate.Deprecations.clearDeprecations();
});
afterEach(() => {
  const deprecations = deprecate.Deprecations.getDeprecations();

  for (const dep of deprecations) {
    if (semver__default["default"].gte(ourVersion, dep.version)) {
      throw new Error(`Found a deprecation that should be removed in ${dep.version}`);
    }
  }
});
