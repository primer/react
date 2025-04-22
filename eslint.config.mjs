import {defineConfig, globalIgnores} from 'eslint/config'
import {fixupConfigRules} from '@eslint/compat'
import globals from 'globals'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import js from '@eslint/js'
import {FlatCompat} from '@eslint/eslintrc'
import githubPlugin from 'eslint-plugin-github'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import playwright from 'eslint-plugin-playwright'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const github = githubPlugin.getFlatConfigs()

const config = defineConfig([
  globalIgnores([
    '**/.cache',
    'coverage/**/*',
    'docs/public/**/*',
    'lib/**/*',
    'types/**/*',
    'consumer-test/**/*',
    'contributor-docs/adrs/*',
    'examples/codesandbox/**/*',
    'packages/react/src/utils/polymorphic.ts',
    '**/storybook-static',
    '**/CHANGELOG.md',
    '**/node_modules/**/*',
    '**/storybook-static/**/*',
    '**/.next/**/*',
    'dist/**/*',
    '**/lib/**/*',
    '**/lib-esm/**/*',
    '**/dist/**/*',
    'script/**/*.ts',
    '**/*.module.css.d.ts',
    '**/.playwright/**',
  ]),

  js.configs.recommended,

  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],

  github.browser,
  github.recommended,
  github.react,

  tseslint.configs.recommended,
  // ...compat.extends('plugin:clsx/recommended'),

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.jest,
        ...globals.node,
        __DEV__: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // 'no-shadow': 'off',
      // 'react/button-has-type': 'error',
      // 'react/prop-types': 'off',
      // 'react/display-name': 'off',
      // 'react-hooks/exhaustive-deps': 'error',
      // camelcase: [
      // 'error',
      // {
      // allow: [
      // 'dark_dimmed',
      // // Allow feature flag names that start with `primer_react_`
      // '^primer_react_',
      // ],
      // },
      // ],
    },
  },

  // // Overrides from updating plugin:github
  // 'filenames/match-regex': 'off',
  // 'i18n-text/no-en': 'off',
  // 'github/no-inner-html': 'off',
  // 'github/role-supports-aria-props': 'off',
  // 'no-restricted-syntax': 'off',
  // 'primer-react/a11y-use-next-tooltip': 'off',
  // },
  // },
  {
    files: ['packages/react/src/**'],
  },

  {
    files: ['**/script/**/*.{ts,tsx,mts,mtsx,cjs,js,mjs}', '**/*.config.{ts,tsx,mts,mtsx,cjs,js,mjs}'],
    rules: {
      'import/extensions': 'off',
      'import/namespace': 'off',
      'import/no-commonjs': 'off',
      'import/no-nodejs-modules': 'off',
      'import/no-dynamic-require': 'off',
      'import/no-unresolved': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  {
    files: ['**/playwright.config.ts', 'e2e/**/*.{ts,tsx}'],
    plugins: {
      playwright: playwright,
    },
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/expect-expect': 'off',
      'playwright/no-conditional-expect': 'off',
      'playwright/no-conditional-in-test': 'off',
      'playwright/no-wait-for-selector': 'off',
      'playwright/valid-title': 'off',
    },
  },
])

export default tseslint.config(config)

// export default defineConfig([
// {
// extends: fixupConfigRules(
// compat.extends(
// 'plugin:react/recommended',
// 'plugin:jsx-a11y/recommended',
// 'plugin:react-hooks/recommended',
// 'plugin:prettier/recommended',
// 'plugin:primer-react/recommended',
// 'plugin:ssr-friendly/recommended',
// ),
// ),

// rules: {
// 'no-shadow': 'off',
// 'react/button-has-type': 'error',
// 'react/prop-types': 'off',
// 'react/display-name': 'off',
// 'react-hooks/exhaustive-deps': 'error',

// camelcase: [
// 'error',
// {
// allow: ['dark_dimmed', '^primer_react_'],
// },
// ],

// 'filenames/match-regex': 'off',
// 'import/extensions': 'off',
// 'import/namespace': 'off',
// 'import/no-commonjs': 'off',
// 'import/no-nodejs-modules': 'off',
// 'import/no-dynamic-require': 'off',
// 'import/no-unresolved': 'off',
// 'i18n-text/no-en': 'off',
// 'github/no-inner-html': 'off',
// 'github/role-supports-aria-props': 'off',
// 'no-restricted-syntax': 'off',
// 'primer-react/a11y-use-next-tooltip': 'off',
// },
// },
// {
// files: ['**/*.{js,jsx}'],

// rules: {
// 'eslint-comments/no-use': 'off',
// 'import/no-namespace': 'off',
// 'import/no-named-as-default': 'off',
// 'import/no-named-as-default-member': 'off',

// 'primer-react/direct-slot-children': [
// 'error',
// {
// skipImportCheck: true,
// },
// ],

// 'no-unused-vars': [
// 'error',
// {
// ignoreRestSiblings: true,
// },
// ],
// },
// },
// {
// files: ['**/*.{ts,tsx}'],
// extends: compat.extends('plugin:@typescript-eslint/recommended'),

// languageOptions: {
// ecmaVersion: 5,
// sourceType: 'script',

// parserOptions: {
// project: ['./tsconfig.json', './packages/**/tsconfig.json', './examples/**/tsconfig.json'],
// },
// },

// rules: {
// '@typescript-eslint/consistent-type-imports': 'error',
// '@typescript-eslint/no-explicit-any': 'error',
// '@typescript-eslint/no-unnecessary-condition': 'error',
// '@typescript-eslint/explicit-module-boundary-types': 'off',

// '@typescript-eslint/no-unused-vars': [
// 'error',
// {
// argsIgnorePattern: '^_',
// },
// ],

// '@typescript-eslint/no-shadow': 'off',
// '@typescript-eslint/no-empty-function': 'off',

// '@typescript-eslint/ban-ts-comment': [
// 'error',
// {
// 'ts-ignore': 'allow-with-description',
// },
// ],

// 'import/default': 'off',
// 'import/no-deprecated': 'off',
// 'import/no-named-as-default': 'off',
// 'import/no-named-as-default-member': 'off',

// 'primer-react/direct-slot-children': [
// 'error',
// {
// skipImportCheck: true,
// },
// ],

// 'no-restricted-imports': [
// 'error',
// {
// paths: [
// {
// name: 'react',
// importNames: ['useLayoutEffect'],
// message:
// 'Please use the `useIsomorphicLayoutEffect` hook from `src/hooks/useIsomorphicLayoutEffect.ts` instead',
// },
// {
// name: 'clsx',
// importNames: ['default'],
// message: 'Use the named import instead: `import {clsx} from "clsx"`',
// },
// ],

// patterns: [
// {
// group: ['**/utils/ssr'],
// importNames: ['useSSRSafeId'],
// message: 'Please use the `useId` hook from `src/hooks/useId.ts` instead',
// },
// ],
// },
// ],
// },
// },
// {
// files: ['**/*.test.{ts,tsx}'],
// extends: compat.extends('plugin:jest/recommended', 'plugin:testing-library/react'),

// rules: {
// '@typescript-eslint/no-non-null-assertion': 'off',
// 'jest/expect-expect': 'off',
// 'jest/no-conditional-expect': 'off',
// 'jest/no-disabled-tests': 'off',
// 'testing-library/prefer-screen-queries': 'off',
// 'testing-library/no-node-access': 'off',
// 'testing-library/no-container': 'off',
// 'testing-library/render-result-naming-convention': 'off',
// 'testing-library/prefer-presence-queries': 'off',
// 'testing-library/prefer-find-by': 'off',
// 'testing-library/no-wait-for-multiple-assertions': 'off',
// },
// },
// {
// files: ['**/*.stories.{ts,tsx}'],
// extends: compat.extends('plugin:storybook/recommended'),
// rules: {},
// },
// {
// files: ['**/*.{md,mdx}'],
// extends: compat.extends('plugin:mdx/recommended'),

// settings: {
// 'mdx/code-blocks': true,
// },

// rules: {
// 'no-unused-vars': 'off',
// 'prettier/prettier': 'off',
// 'react/jsx-no-undef': 'off',
// 'react/no-unescaped-entities': 'off',
// 'primer-react/direct-slot-children': 'off',
// },
// },
// {
// files: ['**/*.{md,mdx}/**'],

// languageOptions: {
// ecmaVersion: 5,
// sourceType: 'script',

// parserOptions: {
// project: false,
// },
// },

// rules: {
// camelcase: 'off',
// 'no-constant-condition': 'off',
// 'no-console': 'off',
// 'no-empty-pattern': 'off',
// 'no-unused-vars': 'off',
// 'no-undef': 'off',
// 'react/no-unescaped-entities': 'off',
// 'react/react-in-jsx-scope': 'off',
// 'react/jsx-no-undef': 'off',
// 'react/jsx-key': 'off',
// 'react/jsx-no-comment-textnodes': 'off',
// 'react-hooks/rules-of-hooks': 'off',
// 'import/no-anonymous-default-export': 'off',
// 'prettier/prettier': 'off',
// 'jsx-a11y/anchor-is-valid': 'off',
// 'jsx-a11y/accessible-emoji': 'off',
// 'jsx-a11y/label-has-for': 'off',
// '@typescript-eslint/no-unnecessary-condition': 'off',
// '@typescript-eslint/no-unused-vars': 'off',
// 'no-redeclare': 'off',
// 'ssr-friendly/no-dom-globals-in-module-scope': 'off',
// 'ssr-friendly/no-dom-globals-in-react-fc': 'off',
// },
// },
// ])

