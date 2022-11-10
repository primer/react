/* eslint-disable github/unescaped-html-literal */
module.exports = {
  testEnvironment: 'jsdom',
  cacheDirectory: '.test',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/stories/**', '!**/*.stories.{js,jsx,ts,tsx}'],
  setupFiles: ['<rootDir>/src/utils/test-helpers.tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/utils/test-matchers.tsx', '<rootDir>/src/utils/test-deprecations.tsx'],
  testMatch: ['<rootDir>/(src|codemods)/**/*.test.[jt]s?(x)', '!**/*.types.test.[jt]s?(x)'],
  transformIgnorePatterns: [
    'node_modules/(?!@github/combobox-nav|@koddsson/textarea-caret|@github/markdown-toolbar-element)'
  ],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname']
}
