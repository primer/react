import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/*/vitest.config.ts',
      'packages/*/vitest.config.mts',
      'packages/*/vitest.config.browser.ts',
      'packages/*/vitest.config.browser.mts',
    ],
    outputFile: {
      html: '.vitest/reports/html',
    },
  },
})
