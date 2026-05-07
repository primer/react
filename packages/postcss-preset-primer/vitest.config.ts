import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['../../script/vitest/setup.ts'],
  },
})
