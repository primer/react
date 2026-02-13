'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-deprecated-experimental-components')

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

ruleTester.run('no-deprecated-experimental-components', rule, {
  valid: [
    {
      code: `import {SelectPanel} from '@primer/react'`,
    },
    {
      code: `import {DataTable} from '@primer/react/experimental'`,
    },
    {
      code: `import {DataTable, ActionBar} from '@primer/react/experimental'`,
    },
    {
      code: `import * as RandomComponent from '@primer/react/experimental'`,
    },
  ],
  invalid: [
    // Single experimental import
    {
      code: `import {SelectPanel} from '@primer/react/experimental'`,
      errors: [
        'The experimental SelectPanel is deprecated. Please import from the stable entrypoint (@primer/react) if available. Check https://primer.style/product/getting-started/react/migration-guides/ for migration guidance or https://primer.style/product/components/ for alternative components.',
      ],
    },
    // Multiple experimental import
    {
      code: `import {SelectPanel, DataTable, ActionBar} from '@primer/react/experimental'`,
      errors: [
        'The experimental SelectPanel is deprecated. Please import from the stable entrypoint (@primer/react) if available. Check https://primer.style/product/getting-started/react/migration-guides/ for migration guidance or https://primer.style/product/components/ for alternative components.',
      ],
    },
  ],
})
