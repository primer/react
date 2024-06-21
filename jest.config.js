/* eslint-disable github/unescaped-html-literal */

'use strict'

/**
 * @type {import('jest').Config}
 */
const config = {
  projects: ['<rootDir>/packages/react'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
}

module.exports = config
