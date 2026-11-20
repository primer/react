import {createRequire} from 'node:module'
import {defineConfig} from '@primer/vitest-config/config'

import react from '@vitejs/plugin-react'
import {playwright} from '@vitest/browser-playwright'
import {vitestPluginRSC} from 'vitest-plugin-rsc'

const require = createRequire(import.meta.url)
// React Server Components need React 19, so the project has no tests on React 18 (the default).
const supportsRSC = Number.parseInt(require('react/package.json').version, 10) >= 19

// vitest-plugin-rsc runs the server (RSC) and client environments inside the test's browser tab,
// so it needs browser mode. It lives in its own project to keep it out of the main browser suite.
export default defineConfig({
  plugins: [react(), vitestPluginRSC()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  define: {
    __DEV__: true,
  },
  test: {
    name: '@primer/react (rsc)',
    include: supportsRSC ? ['src/**/*.rsc.test.?(c|m)[jt]s?(x)'] : [],
    setupFiles: ['config/vitest/rsc/setup.ts'],
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      instances: [{browser: 'chromium'}],
      screenshotFailures: false,
    },
  },
})
