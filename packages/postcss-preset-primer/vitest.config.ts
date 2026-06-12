import {defineConfig} from '@primer/vitest-config/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['@primer/vitest-config/setup'],
    detectAsyncLeaks: true,
  },
})
