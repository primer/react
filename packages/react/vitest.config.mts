import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    name: '@primer/react (node)',
    include: ['src/__tests__/exports.test.ts'],
    environment: 'node',
  },
})
