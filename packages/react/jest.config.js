/* eslint-disable github/unescaped-html-literal */

'use strict'

const path = require('node:path')

const ROOT_DIR = path.resolve(__dirname, '..', '..')

/**
 * @type {import('jest').Config}
 */
module.exports = {
  testEnvironment: require.resolve('jest-config-primer/environment/jsdom'),
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/stories/**', '!**/*.stories.{js,jsx,ts,tsx}'],
  moduleNameMapper: {
    // We need to specify this package subpath because it does not provide a `require` conditional export path
    '@oddbird/popover-polyfill/fn': path.join(
      // Note: we use ROOT_DIR here since this dependency is hoisted
      ROOT_DIR,
      'node_modules',
      '@oddbird',
      'popover-polyfill',
      'dist',
      'popover-fn.js',
    ),
  },
  transform: {
    '\\.module\\.css$': require.resolve('jest-config-primer/transformers/css-modules'),
    '\\.[jt]sx?$': 'babel-jest',
  },
  setupFiles: ['<rootDir>/src/utils/test-helpers.tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/utils/test-matchers.tsx', '<rootDir>/src/utils/test-deprecations.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!@github/combobox-nav|@koddsson/textarea-caret|@github/[a-z-]+-element|@lit-labs/react|@oddbird/popover-polyfill)',
  ],
}
