'use strict'

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: true,
      typescript: true,
    },
  },
  ignorePatterns: [
    'node_modules',
    '.cache',
    'coverage/**/*',
    'docs/public/**/*',
    'dist/**/*',
    'lib/**/*',
    'lib-*/**/*',
    'types/**/*',
    'consumer-test/**/*',
    'contributor-docs/adrs/*',
    'examples/nextjs/**',
    // Note: this file is inlined from an external dependency
    'src/utils/polymorphic.ts',
    'storybook-static',
    'CHANGELOG.md',
  ],
  globals: {
    __DEV__: 'readonly',
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:github/recommended',
    'plugin:github/browser',
    'plugin:primer-react/recommended',
    'plugin:import/typescript',
  ],
  // rules which apply to JS, TS, etc.
  rules: {
    'no-shadow': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'jsx-a11y/label-has-for': [
      2,
      {
        components: [],
      },
    ],
    camelcase: [
      'error',
      {
        allow: ['dark_dimmed'],
      },
    ],
    'primer-react/no-deprecated-colors': ['warn', {checkAllStrings: true}],
  },
  overrides: [
    // rules which apply only to JS
    {
      files: ['**/*.{js,jsx}'],
      rules: {
        'eslint-comments/no-use': 'off',
        'import/no-namespace': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
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
      parserOptions: {
        project: 'tsconfig.json',
      },
      files: ['**/*.{ts,tsx}'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-explicit-any': 2,
        '@typescript-eslint/no-unnecessary-condition': 2,
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
          },
        ],
        '@typscript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-ignore': 'allow-with-description',
          },
        ],
        'import/default': 'off',
        'import/no-deprecated': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@react-aria/ssr',
                importNames: ['useSSRSafeId'],
                message: 'Please use the `useId` hook from `src/hooks/useId.ts` instead',
              },
            ],
            patterns: [],
          },
        ],
      },
    },

    // Tests
    {
      files: ['src/**/*.test.{ts,tsx}'],
      extends: ['plugin:jest/recommended'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        'jest/expect-expect': 'off',
        'jest/no-conditional-expect': 'off',
        'jest/no-disabled-tests': 'off',
      },
    },

    // Stories
    {
      files: ['**/*.stories.{ts,tsx}'],
      extends: ['plugin:storybook/recommended'],
      rules: {},
    },

    // e2e tests
    {
      files: ['playwright.config.ts', 'e2e/**/*.{ts,tsx}'],
      parserOptions: {
        project: 'tsconfig.json',
      },
      rules: {
        'github/array-foreach': 'off',
      },
    },

    // rules which apply only to Markdown
    {
      files: ['**/*.{md,mdx}'],
      extends: ['plugin:mdx/recommended'],
      settings: {
        'mdx/code-blocks': true,
      },
      rules: {
        'prettier/prettier': 'off',
        'react/jsx-no-undef': 'off',
      },
    },

    // rules which apply only to Markdown code blocks
    {
      files: ['**/*.{md,mdx}/**'],
      rules: {
        camelcase: 'off',
        'no-constant-condition': 'off',
        'no-console': 'off',
        'no-empty-pattern': 'off',
        'no-unused-vars': 'off',
        'no-undef': 'off',
        'react/no-unescaped-entities': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-no-undef': 'off',
        'react/jsx-key': 'off',
        'react/jsx-no-comment-textnodes': 'off',
        'import/no-anonymous-default-export': 'off',
        'prettier/prettier': 'off',
        // These a11y rules should eventually be re-enabled
        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/accessible-emoji': 'off',
        'jsx-a11y/label-has-for': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'primer-react/no-deprecated-colors': ['error', {skipImportCheck: true}],
        'no-redeclare': 'off',
      },
    },
  ],
}
