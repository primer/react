/* eslint-disable github/unescaped-html-literal */
module.exports = {
  cacheDirectory: '.test',
  collectCoverage: true,
  collectCoverageFrom: ['src/*.js'],
  setupFilesAfterEnv: ['<rootDir>/src/utils/test-matchers.tsx', '<rootDir>/src/utils/test-deprecations.tsx']
}
