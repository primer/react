'use strict'

const {RuleTester} = require('eslint')
const rule = require('../use-deprecated-from-deprecated')

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

ruleTester.run('use-deprecated-from-deprecated', rule, {
  valid: [],
  invalid: [
    // Single deprecated import
    {
      code: `import {Tooltip} from '@primer/react'`,
      output: `import {Tooltip} from '@primer/react/deprecated'`,
      errors: ['Import deprecated components from @primer/react/deprecated'],
    },

    // Single deprecated import with existing deprecated entrypoint
    {
      code: `import {Tooltip} from '@primer/react'
import {Dialog} from '@primer/react/deprecated'`,
      output: `\nimport {Dialog, Tooltip} from '@primer/react/deprecated'`,
      errors: ['Import deprecated components from @primer/react/deprecated'],
    },

    // Multiple deprecated imports
    {
      code: `import {Dialog, Tooltip} from '@primer/react'`,
      output: `import {Dialog, Tooltip} from '@primer/react/deprecated'`,
      errors: ['Import deprecated components from @primer/react/deprecated'],
    },

    // Mixed deprecated and non-deprecated imports
    {
      code: `import {Button, Tooltip} from '@primer/react'`,
      output: `import {Button, } from '@primer/react'
import {Tooltip} from '@primer/react/deprecated'`,
      errors: ['Import deprecated components from @primer/react/deprecated'],
    },

    // Mixed deprecated and non-deprecated imports with existing deprecated
    {
      code: `import {Button, Tooltip} from '@primer/react'
import {Dialog} from '@primer/react/deprecated'`,
      output: `import {Button, } from '@primer/react'
import {Dialog, Tooltip} from '@primer/react/deprecated'`,
      errors: ['Import deprecated components from @primer/react/deprecated'],
    },

    // Multiple mixed deprecated and non-deprecated imports
    {
      code: `import {Button, Dialog, Tooltip} from '@primer/react'`,
      output: `import {Button,  } from '@primer/react'
import {Dialog, Tooltip} from '@primer/react/deprecated'`,
      errors: ['Import deprecated components from @primer/react/deprecated'],
    },
  ],
})
