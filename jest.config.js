module.exports = {
  cacheDirectory: '.test',
  collectCoverage: true,
  collectCoverageFrom: ['src/*.js'],
  setupFilesAfterEnv: ['<rootDir>/src/utils/test-matchers.js']
}
