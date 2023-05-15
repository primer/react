/* eslint-disable github/unescaped-html-literal */

'use strict'

const {REACT_VERSION_17} = process.env

/**
 * @type {import('jest').Config}
 */
module.exports = {
  globals: {
    REACT_VERSION_LATEST: REACT_VERSION_17 ? REACT_VERSION_17 !== 'true' : true,
    REACT_VERSION_17: REACT_VERSION_17 === 'true',
  },
  testEnvironment: 'jsdom',
  cacheDirectory: '.test',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/stories/**', '!**/*.stories.{js,jsx,ts,tsx}'],
  moduleNameMapper: {
    '\\.css$': 'jest-css-modules',
  },
  setupFiles: ['<rootDir>/src/utils/test-helpers.tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/utils/test-matchers.tsx', '<rootDir>/src/utils/test-deprecations.tsx'],
  testMatch: ['<rootDir>/(src|codemods)/**/*.test.[jt]s?(x)', '!**/*.types.test.[jt]s?(x)'],
  transformIgnorePatterns: [
    'node_modules/(?!@github/combobox-nav|@koddsson/textarea-caret|@github/[a-z-]+-element|@lit-labs/react)',
  ],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
}
