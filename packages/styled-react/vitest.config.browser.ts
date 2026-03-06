import path from 'node:path'
import react from '@vitejs/plugin-react'
import {playwright} from '@vitest/browser-playwright'
import {defineConfig} from 'vitest/config'

export default defineConfig({
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
    name: '@primer/styled-react (browser)',
    include: ['src/**/*.browser.test.?(c|m)[jt]s?(x)'],
    setupFiles: ['config/vitest/browser/setup.ts'],
    browser: {
      provider: playwright(),
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
