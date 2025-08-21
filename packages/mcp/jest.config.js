export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: ['/node_modules/(?!@modelcontextprotocol)'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
}
