import {defineConfig} from '@primer/vitest-config/config'

export default defineConfig({
  define: {
    __DEV__: true,
  },
  test: {
    environment: 'node',
    setupFiles: ['@primer/vitest-config/setup'],
    detectAsyncLeaks: true,
  },
})
