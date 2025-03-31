import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    workspace: ['packages/postcss-preset-primer', 'packages/rollup-plugin-import-css'],
  },
})
