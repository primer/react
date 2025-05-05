/* eslint-disable github/unescaped-html-literal */

'use strict'

/**
 * @type {import('jest').Config}
 */
const config = {
  setupFiles: [],
  setupFilesAfterEnv: [],
  testMatch: ['<rootDir>/**/*.test.[jt]s?(x)', '!**/*.types.test.[jt]s?(x)'],
  transform: {
    '^.+\\.(js|ts|tsx)$': require.resolve('./config/transform/jsTransform.js'),
  },
  transformIgnorePatterns: [],
}

module.exports = config
