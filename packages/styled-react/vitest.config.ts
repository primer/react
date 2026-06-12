import {defineConfig} from 'vitest/config'

export default defineConfig({
  define: {
    __VITEST_FAIL_ON_CONSOLE__: JSON.stringify(process.env.VITEST_FAIL_ON_CONSOLE === 'true'),
  },
  test: {
    name: '@primer/styled-react (node)',
    environment: 'node',
    setupFiles: ['@primer/vitest-config/setup'],
    exclude: ['src/**/*.browser.test.?(c|m)[jt]s?(x)'],
    detectAsyncLeaks: true,
  },
})
