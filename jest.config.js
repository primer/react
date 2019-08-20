module.exports = {
  cacheDirectory: '.test',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/*.js'
  ],
  setupTestFrameworkScriptFile: '<rootDir>/src/utils/test-matchers.js'
}
