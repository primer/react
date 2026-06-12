import {defineConfig} from '@primer/vitest-config/config'

export default defineConfig({
  define: {
    __VITEST_FAIL_ON_CONSOLE__: JSON.stringify(process.env.VITEST_FAIL_ON_CONSOLE === 'true'),
  },
  test: {
    environment: 'node',
    setupFiles: ['@primer/vitest-config/setup'],
    detectAsyncLeaks: true,
  },
})
