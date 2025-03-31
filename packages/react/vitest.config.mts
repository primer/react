import react from '@vitejs/plugin-react'
import {defineConfig} from 'vitest/config'
import postcssPresetPrimer from 'postcss-preset-primer'

const config = defineConfig({
  define: {
    __DEV__: true,
  },
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: 'prc-[folder]-[local]-[hash:base64:5]',
    },
    postcss: {
      plugins: [postcssPresetPrimer()],
    },
  },
  test: {
    include: [
      'src/ActionBar/**/*.test.?(c|m)[jt]s?(x)',
      'src/experimental/**/*.test.?(c|m)[jt]s?(x)',
      'src/FeatureFlags/**/*.test.?(c|m)[jt]s?(x)',
    ],
    exclude: ['src/**/*.browser.test.?(c|m)[jt]s?(x)'],
    environment: 'jsdom',
    setupFiles: ['config/vitest/setup.ts'],
  },
})

export default config
