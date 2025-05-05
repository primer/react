import {defineConfig, globalIgnores} from 'eslint/config'
import {fixupConfigRules, fixupPluginRules} from '@eslint/compat'
import globals from 'globals'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import js from '@eslint/js'
import {FlatCompat} from '@eslint/eslintrc'
import githubPlugin from 'eslint-plugin-github'
import jest from 'eslint-plugin-jest'
import storybook from 'eslint-plugin-storybook'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import playwright from 'eslint-plugin-playwright'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import primerReact from 'eslint-plugin-primer-react'
import testingLibrary from 'eslint-plugin-testing-library'
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

  prettierRecommended,

  tseslint.configs.recommended,
  {
    extends: fixupConfigRules(compat.extends('plugin:clsx/recommended', 'plugin:ssr-friendly/recommended')),
  },

  // eslint-plugin-primer-react
  {
    plugins: {
      'primer-react': fixupPluginRules(primerReact),
    },
    rules: {
      'primer-react/direct-slot-children': 'error',
      'primer-react/no-system-props': 'error',
      'primer-react/a11y-tooltip-interactive-trigger': 'error',
      'primer-react/new-color-css-vars': 'error',
      'primer-react/a11y-explicit-heading': 'error',
      'primer-react/no-deprecated-props': 'error',
      'primer-react/a11y-remove-disable-tooltip': 'error',
      'primer-react/a11y-use-next-tooltip': 'error',
      'primer-react/no-unnecessary-components': 'error',
      'primer-react/prefer-action-list-item-onselect': 'error',
    },
  },

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
      'no-shadow': 'off',
      'react/button-has-type': 'error',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/jsx-uses-react': 'error',
      'react-hooks/exhaustive-deps': 'error',
      camelcase: [
        'error',
        {
          allow: [
            'dark_dimmed',
            // Allow feature flag names that start with `primer_react_`
            '^primer_react_',
          ],
        },
      ],
      // Overrides from updating plugin:github
      'filenames/match-regex': 'off',
      'import/extensions': 'off',
      'import/namespace': 'off',
      'import/no-commonjs': 'off',
      'import/no-nodejs-modules': 'off',
      'import/no-dynamic-require': 'off',
      'import/no-unresolved': 'off',
      'i18n-text/no-en': 'off',
      'github/filenames-match-regex': 'off',
      'github/no-inner-html': 'off',
      'github/role-supports-aria-props': 'off',
      'no-restricted-syntax': 'off',
      'primer-react/a11y-use-next-tooltip': 'off',
    },
  },

  // rules which apply only to JS
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'eslint-comments/no-use': 'off',
      'import/no-namespace': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'primer-react/direct-slot-children': ['error', {skipImportCheck: true}],
      'no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // rules which apply only to TS
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description',
        },
      ],
      // Remove after initial migration to eslint v9
      '@typescript-eslint/no-unused-expressions': 'off',
      'import/default': 'off',
      'import/no-deprecated': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'primer-react/direct-slot-children': ['error', {skipImportCheck: true}],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              importNames: ['useLayoutEffect'],
              message:
                'Please use the `useIsomorphicLayoutEffect` hook from `src/hooks/useIsomorphicLayoutEffect.ts` instead',
            },
            {
              name: 'clsx',
              importNames: ['default'],
              message: 'Use the named import instead: `import {clsx} from "clsx"`',
            },
          ],
          patterns: [
            {
              group: ['**/utils/ssr'],
              importNames: ['useSSRSafeId'],
              message: 'Please use the `useId` hook from `src/hooks/useId.ts` instead',
            },
          ],
        },
      ],
    },
  },

  // Tests
  // eslint-plugin-jest
  {
    files: ['**/*.test.{ts,tsx}'],
    ignores: ['**/e2e/**'],
    plugins: {
      jest,
      ['testing-library']: testingLibrary,
    },
    languageOptions: {
      globals: jest.environments.globals.globals,
    },
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/expect-expect': 'off',
      'jest/no-conditional-expect': 'off',
      'jest/no-disabled-tests': 'off',
    },
  },

  // eslint-plugin-testing-library
  {
    files: ['**/*.test.{ts,tsx}'],
    ignores: ['**/e2e/**'],
    plugins: {
      testingLibrary,
    },
    ...testingLibrary.configs['flat/react'],
    rules: {
      'testing-library/prefer-screen-queries': 'off',
      'testing-library/no-node-access': 'off',
      'testing-library/no-container': 'off',
      'testing-library/render-result-naming-convention': 'off',
      'testing-library/prefer-presence-queries': 'off',
      'testing-library/prefer-find-by': 'off',
      'testing-library/no-wait-for-multiple-assertions': 'off',
    },
  },

  {
    files: ['**/*.types.test.{ts,tsx}'],
    rules: {
      // We often use assertions that are not used in type tests
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Script files that run in a Node.js context and may be CommonJS
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

  // Packages that may run in a Node.js context
  {
    files: [
      'packages/postcss-preset-primer/**/**.{ts,tsx,mts,mtsx,cjs,js,mjs}',
      'packages/rollup-plugin-import-css/**/**.{ts,tsx,mts,mtsx,cjs,js,mjs}',
    ],
    rules: {
      'import/no-nodejs-modules': 'off',
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

  // Storybook stories
  ...storybook.configs['flat/recommended'],
])

export default tseslint.config(config)
