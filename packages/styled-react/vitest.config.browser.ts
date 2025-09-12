import react from '@vitejs/plugin-react'
import {defineConfig} from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  define: {
    __DEV__: true,
  },
  test: {
    include: ['src/**/*.browser.test.?(c|m)[jt]s?(x)'],
    setupFiles: ['config/vitest/browser/setup.ts'],
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
