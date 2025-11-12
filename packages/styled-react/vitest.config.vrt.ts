import path from 'node:path'
import react from '@vitejs/plugin-react'
import {playwright} from '@vitest/browser-playwright'
import {defineConfig} from 'vitest/config'
import postcssPresetPrimer from 'postcss-preset-primer'

export default defineConfig({
  css: {
    modules: {
      generateScopedName: 'prc-[folder]-[local]-[hash:base64:5]',
    },
    postcss: {
      plugins: [postcssPresetPrimer()],
    },
  },
  plugins: [react()],
  define: {
    __DEV__: true,
  },
  resolve: {
    alias: [
      {
        find: '@primer/react/experimental',
        replacement: path.resolve(import.meta.dirname, '..', 'react', 'src', 'experimental', 'index.ts'),
      },
      {
        find: '@primer/react/deprecated',
        replacement: path.resolve(import.meta.dirname, '..', 'react', 'src', 'deprecated', 'index.ts'),
      },
      {
        find: '@primer/react',
        replacement: path.resolve(import.meta.dirname, '..', 'react', 'src', 'index.ts'),
      },
    ],
  },
  test: {
    name: '@primer/styled-react (vrt)',
    include: ['src/**/*.visual.test.?(c|m)[jt]s?(x)'],
    setupFiles: ['config/vitest/browser/setup.ts', 'config/vitest/visual/setup.ts'],
    browser: {
      provider: playwright(),
      enabled: true,
      headless: process.env.DEBUG_BROWSER_TESTS === 'true' ? false : true,
      instances: [
        {
          browser: 'chromium',
          viewport: {
            width: 320,
            height: 320,
          },
        },
      ],
      screenshotFailures: false,
    },
  },
})
