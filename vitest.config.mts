import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/*/vitest.config.ts',
      'packages/*/vitest.config.mts',
      'packages/*/vitest.config.browser.ts',
      'packages/*/vitest.config.browser.mts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['packages/react/src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.stories.{ts,tsx}',
        '**/*.types.test.{ts,tsx}',
        '**/*.figma.tsx',
        '**/test-helpers/**',
        '**/__tests__/**',
        '**/generated/**',
      ],
    },
  },
})
