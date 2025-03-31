import react from '@vitejs/plugin-react'
import {defineConfig} from 'vitest/config'
import postcssPresetPrimer from 'postcss-preset-primer'

const config = defineConfig({
  define: {
    __DEV__: true,
    'process.env': process.env,
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
    name: '@primer/react (browser)',
    include: ['**/*.browser.test.?(c|m)[jt]s?(x)'],
    setupFiles: ['config/vitest/setup.ts'],
    browser: {
      provider: 'playwright',
      enabled: true,
      headless: true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
})

export default config
