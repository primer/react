'use strict'

const js = require('@eslint/js')
const globals = require('globals')
const github = require('eslint-plugin-github')

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
module.exports = [
  {
    ignores: ['node_modules/**', '.git/**'],
  },
  js.configs.recommended,
  github.default.getFlatConfigs().recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.commonjs,
        ...globals.node,
      },
    },
    rules: {
      // Override specific rules for the repository
      'import/no-commonjs': 'off',
      'import/no-dynamic-require': 'off', // Allow dynamic requires in tests
      'no-shadow': 'off',
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
        },
      ],
      'github/filenames-match-regex': 'off', // Allow various file naming patterns
      'i18n-text/no-en': 'off', // Allow English text in this repository
    },
  },
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'no-undef': 'off', // Allow require() in config file
    },
  },
]
