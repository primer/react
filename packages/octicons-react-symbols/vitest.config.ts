import react from '@vitejs/plugin-react'
import {playwright} from '@vitest/browser-playwright'
import {defineConfig} from 'vitest/config'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-react-compiler',
            {
              target: '18',
            },
          ],
        ],
      },
    }),
  ],
  test: {
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
