'use strict'

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
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
  ignorePatterns: [
    '**/node_modules/**',
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
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
    react: {
      version: 'detect',
    },
  },
  root: true,
  // rules which apply to JS, TS, etc.
  rules: {
    'no-shadow': 0,
    'react/prop-types': 0,
    'react/display-name': 0,
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
    // Rules disabled as part of moving to latest version
    'filenames/match-regex': 'off',
    // React.useState() pattern is a warning if pulled from default export
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',
    'import/default': 'off',
    'import/no-deprecated': 'off',
    'import/no-commonjs': 'off',
    'import/no-dynamic-require': 'off',
    'import/extensions': 'off',
    'import/no-nodejs-modules': 'off',
    'i18n-text/no-en': 'off',
    'github/no-inner-html': 'off',
  },
  overrides: [
    // JavaScript
    {
      files: ['**/*.{js,jsx}'],
      rules: {
        'eslint-comments/no-use': 0,
        'import/no-namespace': 0,
        'no-unused-vars': [
          'error',
          {
            ignoreRestSiblings: true,
          },
        ],
      },
    },

    // TypeScript
    {
      files: ['**/*.{ts,tsx}'],
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'error',
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
      files: ['**/*.test.{ts,tsx,js}'],
      extends: ['plugin:jest/recommended'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 0,
      },
    },

    // Markdown
    {
      files: ['**/*.{md,mdx}'],
      extends: ['plugin:mdx/recommended'],
      // parserOptions: {
      // project: 'tsconfig.json',
      // },
      settings: {
        'mdx/code-blocks': true,
      },
      rules: {
        'prettier/prettier': 'off',
      },
    },

    // Markdown code blocks
    {
      files: ['**/*.{md,mdx}/**'],
      parserOptions: {
        project: false,
      },
      rules: {
        camelcase: 0,
        'no-constant-condition': 0,
        'no-console': 0,
        'no-empty-pattern': 0,
        'no-unused-vars': 0,
        'no-undef': 0,
        'react/no-unescaped-entities': 0,
        'react/react-in-jsx-scope': 0,
        'react/jsx-no-undef': 0,
        'react/jsx-key': 0,
        'react/jsx-no-comment-textnodes': 0,
        'import/no-anonymous-default-export': 0,
        'prettier/prettier': 0,
        // These a11y rules should eventually be re-enabled
        'jsx-a11y/anchor-is-valid': 0,
        'jsx-a11y/accessible-emoji': 0,
        'jsx-a11y/label-has-for': 0,
        '@typescript-eslint/no-unnecessary-condition': 0,
        '@typescript-eslint/no-unused-vars': 0,
        'primer-react/no-deprecated-colors': ['error', {skipImportCheck: true}],
        'no-redeclare': 0,
      },
    },
  ],
}
