import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    name: '@primer/styled-react (node)',
    environment: 'node',
    setupFiles: ['@primer/vitest-config/setup'],
    exclude: ['src/**/*.browser.test.?(c|m)[jt]s?(x)'],
    detectAsyncLeaks: true,
  },
})
