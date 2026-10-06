import {defineConfig} from '@primer/vitest-config/config'

export default defineConfig({
  test: {
    name: '@primer/cli',
    environment: 'node',
    detectAsyncLeaks: true,
  },
})
