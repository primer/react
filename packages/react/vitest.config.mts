import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    __DEV__: true,
  },
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/lib-esm/**',
      '**/lib/**',
      '**/generated/**',
      '**/*.figma.tsx',
      '**/*.types.test.tsx',
    ],
    include: [
      'src/ActionBar/**/*.test.?(c|m)[jt]s?(x)',
      'src/AnchoredOverlay/**/*.test.?(c|m)[jt]s?(x)',
      'src/Banner/**/*.test.?(c|m)[jt]s?(x)',
      'src/Blankslate/**/*.test.?(c|m)[jt]s?(x)',
      'src/BranchName/**/*.test.?(c|m)[jt]s?(x)',
      'src/Breadcrumbs/**/*.test.?(c|m)[jt]s?(x)',
      'src/ButtonGroup/**/*.test.?(c|m)[jt]s?(x)',
      'src/CheckboxGroup/**/*.test.?(c|m)[jt]s?(x)',
      'src/CircleBadge/**/*.test.?(c|m)[jt]s?(x)',
      'src/CircleOcticon/**/*.test.?(c|m)[jt]s?(x)',
      'src/DataTable/**/*.test.?(c|m)[jt]s?(x)',
      'src/FeatureFlags/**/*.test.?(c|m)[jt]s?(x)',
      'src/Select/**/*.test.?(c|m)[jt]s?(x)',
      'src/Skeleton/**/*.test.?(c|m)[jt]s?(x)',
      'src/Spinner/**/*.test.?(c|m)[jt]s?(x)',
      'src/Stack/**/*.test.?(c|m)[jt]s?(x)',
      'src/StateLabel/**/*.test.?(c|m)[jt]s?(x)',
      'src/SubNav/**/*.test.?(c|m)[jt]s?(x)',
      'src/TabNav/**/*.test.?(c|m)[jt]s?(x)',
      'src/Text/**/*.test.?(c|m)[jt]s?(x)',
      'src/TextInputWithTokens/**/*.test.?(c|m)[jt]s?(x)',
      'src/Timeline/**/*.test.?(c|m)[jt]s?(x)',
      'src/ToggleSwitch/**/*.test.?(c|m)[jt]s?(x)',
      'src/Tooltip/**/*.test.?(c|m)[jt]s?(x)',
      'src/TooltipV2/**/*.test.?(c|m)[jt]s?(x)',
      'src/Truncate/**/*.test.?(c|m)[jt]s?(x)',
      'src/UnderlineNav/**/*.test.?(c|m)[jt]s?(x)',
    ],
    setupFiles: ['config/vitest/setup.ts'],
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
    },
  },
})
