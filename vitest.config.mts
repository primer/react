import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    workspace: ['packages/*', 'packages/*/vitest.config.mts', 'packages/*/vitest.config.browser.mts'],
  },
})
