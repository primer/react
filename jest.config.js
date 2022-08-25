/* eslint-disable github/unescaped-html-literal */
module.exports = {
  testEnvironment: 'jsdom',
  cacheDirectory: '.test',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/stories/**', '!**/*.stories.{js,jsx,ts,tsx}'],
  setupFilesAfterEnv: [
    '<rootDir>/src/utils/test-matchers.tsx',
    '<rootDir>/src/utils/test-deprecations.tsx',
    '<rootDir>/src/utils/test-helpers.tsx'
  ],
  testMatch: ['<rootDir>/(src|codemods)/**/*.test.[jt]s?(x)', '!**/*.types.test.[jt]s?(x)'],

  // Note: this configuration option should not exclude any packages within
  // `node_modules`. When excluding packages from `node_modules`, we have no way
  // to test if this package is shipping with support for both ESM and CommonJS
  // @see https://github.com/primer/react/issues/2275
  transformIgnorePatterns: ['/node_modules/']
}
