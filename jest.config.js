/* eslint-disable github/unescaped-html-literal */
'use strict'

const useReact18 = process.env.REACT_18 === 'true'

module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/stories/**', '!**/*.stories.{js,jsx,ts,tsx}'],
  moduleNameMapper: useReact18
    ? {
        '^react$': require.resolve('react-18'),
        '^react-dom$': require.resolve('react-dom-18'),
        '^react-dom/client$': require.resolve('react-dom-18/client'),
        '^react-dom/server$': require.resolve('react-dom-18/server'),
        '^react-dom/test-utils$': require.resolve('react-dom-18/test-utils'),
        '^react-test-renderer$': require.resolve('react-test-renderer-18'),
        '^@testing-library/react$': require.resolve('@testing-library/react-18'),
      }
    : {},
  setupFiles: ['<rootDir>/src/utils/test-helpers.tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/utils/test-matchers.tsx', '<rootDir>/src/utils/test-deprecations.tsx'],
  testMatch: ['<rootDir>/(src|codemods)/**/*.test.[jt]s?(x)', '!**/*.types.test.[jt]s?(x)'],
  transformIgnorePatterns: [
    'node_modules/(?!@github/combobox-nav|@koddsson/textarea-caret|@github/[a-z-]+-element|@lit-labs/react)',
  ],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
}
