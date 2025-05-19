/* eslint-disable github/unescaped-html-literal */

'use strict'

/**
 * @type {import('jest').Config}
 */
module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/stories/**', '!**/*.stories.{js,jsx,ts,tsx}'],
  moduleNameMapper: {
    '\\.css$': 'jest-css-modules',
  },
  setupFiles: ['<rootDir>/src/utils/test-helpers.tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/utils/test-matchers.tsx', '<rootDir>/src/utils/test-deprecations.tsx'],
  testMatch: ['<rootDir>/**/*.test.[jt]s?(x)', '!**/*.types.test.[jt]s?(x)'],
  modulePathIgnorePatterns: [
    '<rootDir>/src/ActionBar/',
    '<rootDir>/src/AnchoredOverlay/',
    '<rootDir>/src/Banner/',
    '<rootDir>/src/Blankslate/',
    '<rootDir>/src/BranchName/',
    '<rootDir>/src/Breadcrumbs/',
    '<rootDir>/src/ButtonGroup/',
    '<rootDir>/src/CheckboxGroup/',
    '<rootDir>/src/CircleBadge/',
    '<rootDir>/src/CircleOcticon/',
    '<rootDir>/src/DataTable/',
    '<rootDir>/src/FeatureFlags/',
    '<rootDir>/src/Link/',
    '<rootDir>/src/Select/',
    '<rootDir>/src/Skeleton/',
    '<rootDir>/src/Spinner/',
    '<rootDir>/src/Stack/',
    '<rootDir>/src/StateLabel/',
    '<rootDir>/src/SubNav/',
    '<rootDir>/src/TabNav/',
    '<rootDir>/src/TextInputWithTokens/',
    '<rootDir>/src/Timeline/',
    '<rootDir>/src/ToggleSwitch/',
    '<rootDir>/src/Tooltip/',
    '<rootDir>/src/TooltipV2/',
    '<rootDir>/src/Truncate/',
    '<rootDir>/src/UnderlineNav/',
  ],
  transformIgnorePatterns: ['node_modules/(?!@github/[a-z-]+-element|@lit-labs/react|@oddbird/popover-polyfill)'],
}
