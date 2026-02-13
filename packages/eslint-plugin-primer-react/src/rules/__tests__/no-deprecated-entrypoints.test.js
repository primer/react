'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-deprecated-entrypoints')

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('no-deprecated-entrypoints', rule, {
  valid: [`import {Box} from '@primer/react';`],
  invalid: [
    {
      code: `import {DataTable} from '@primer/react/drafts';`,
      output: `import {DataTable} from '@primer/react/experimental';`,
      errors: [
        {
          message:
            'The drafts entrypoint is deprecated and will be removed in the next major release. Use the experimental entrypoint instead',
        },
      ],
    },
  ],
})
