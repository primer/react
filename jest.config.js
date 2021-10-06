/* eslint-disable github/unescaped-html-literal */
module.exports = {
  testEnvironment: 'jsdom',
  cacheDirectory: '.test',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/stories/**'],
  setupFilesAfterEnv: [
    '<rootDir>/src/utils/test-matchers.tsx',
    '<rootDir>/src/utils/test-deprecations.tsx',
    '<rootDir>/src/utils/test-helpers.tsx'
  ],
  testMatch: ['(src|codemods)/__tests__/**/*.test.[jt]s?(x)', '!(src|codemods)/__tests__/**/*.types.test.[jt]s?(x)']
}
