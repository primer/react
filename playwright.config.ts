import path from 'node:path'
import {Config} from '@playwright/test'
import './e2e/matchers/toHaveNoViolations'

const config: Config = {
  // https://playwright.dev/docs/api/class-testconfig#test-config-test-dir
  testDir: path.join(__dirname, 'e2e'),
  testIgnore: ['**/matchers/**', '**/test-helpers/**'],
  testMatch: '**/*.test.ts',

  // https://playwright.dev/docs/api/class-testconfig#test-config-timeout
  timeout: 1000 * 15,

  // https://playwright.dev/docs/api/class-testconfig#test-config-output-dir
  outputDir: path.join(__dirname, '.playwright', 'results'),
  snapshotDir: path.join(__dirname, '.playwright', 'snapshots'),

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    screenshot: 'only-on-failure'
  },
  expect: {
    toHaveScreenshot: {
      animations: 'disabled'
    }
  },
  reporter: [
    ['line'],
    ['html', {open: 'never', outputFolder: path.join(__dirname, '.playwright/report')}],
    [
      'json',
      {
        outputFile: path.join(__dirname, '.playwright', 'results.json')
      }
    ]
  ]
}

export default config
