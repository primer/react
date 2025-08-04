import react from '@vitejs/plugin-react'
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
    'process.env.CI': JSON.stringify(process.env.CI),
  },
  test: {
    name: '@primer/react',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/lib-esm/**',
      '**/lib/**',
      '**/generated/**',
      '**/*.figma.tsx',
      '**/*.types.test.tsx',
      'src/__tests__/exports.test.ts',
      'src/__tests__/storybook.test.tsx',
    ],
    include: ['src/**/*.test.?(c|m)[jt]s?(x)'],
    setupFiles: ['config/vitest/setup.ts', 'config/vitest/browser/setup.ts'],
    css: {
      include: [/.+/],
    },
    browser: {
      provider: 'playwright',
      enabled: true,
      headless: process.env.DEBUG_BROWSER_TESTS === 'true' ? false : true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
      screenshotFailures: false,
    },
  },
})
