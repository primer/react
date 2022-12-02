/* eslint-disable github/unescaped-html-literal */
'use strict'

const useReact18 = process.env.REACT_18 === 'true'

module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/stories/**', '!**/*.stories.{js,jsx,ts,tsx}'],
  moduleNameMapper: {
    '^react$': useReact18 ? require.resolve('react-18') : require.resolve('react'),
    '^react-dom$': useReact18 ? require.resolve('react-dom-18') : require.resolve('react-dom'),
    '^react-dom/client$': useReact18 ? require.resolve('react-dom-18/client') : require.resolve('react-dom/client'),
    '^react-dom/server$': useReact18 ? require.resolve('react-dom-18/server') : require.resolve('react-dom/server'),
    '^react-dom/test-utils$': useReact18
      ? require.resolve('react-dom-18/test-utils')
      : require.resolve('react-dom/test-utils'),
    '^react-test-renderer$': useReact18
      ? require.resolve('react-test-renderer-18')
      : require.resolve('react-test-renderer'),
    '^@testing-library/react$': useReact18
      ? require.resolve('@testing-library/react-18')
      : require.resolve('@testing-library/react')
  },
  setupFiles: ['<rootDir>/src/utils/test-helpers.tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/utils/test-matchers.tsx', '<rootDir>/src/utils/test-deprecations.tsx'],
  testMatch: ['<rootDir>/(src|codemods)/**/*.test.[jt]s?(x)', '!**/*.types.test.[jt]s?(x)'],
  transformIgnorePatterns: [
    'node_modules/(?!@github/combobox-nav|@koddsson/textarea-caret|@github/markdown-toolbar-element)'
  ],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname']
}
