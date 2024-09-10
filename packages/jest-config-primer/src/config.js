'use strict'

/**
 * @type {import('jest').Config}
 */
const config = {
  testEnvironment: require.resolve('./environment/jsdom'),
  moduleNameMapper: {
    '\\.module\\.css$': require.resolve('./transform/css-modules'),
  },
  testMatch: ['<rootDir>/**/*.test.[jt]s?(x)', '!**/*.types.test.[jt]s?(x)'],
}

module.exports = config
