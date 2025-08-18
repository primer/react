import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    exclude: ['src/**/*.browser.test.?(c|m)[jt]s?(x)'],
  },
})
