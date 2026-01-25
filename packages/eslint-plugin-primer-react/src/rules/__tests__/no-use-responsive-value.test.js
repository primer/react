'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-use-responsive-value')

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

ruleTester.run('no-use-responsive-value', rule, {
  valid: [
    // Valid - not importing useResponsiveValue
    `import { Button } from '@primer/react'`,

    // Valid - importing from other modules
    `import { useResponsiveValue } from 'other-module'`,

    // Valid - using other hooks from @primer/react
    `import { useTheme } from '@primer/react'`,

    // Valid - function with same name but not imported from @primer/react
    `function useResponsiveValue() { return 'custom' }`,

    // Valid - importing from unrelated local paths
    `import { something } from '../utils/helpers'`,

    // Valid - importing other hooks from local paths
    `import { useCustomHook } from '../hooks/useCustomHook'`,
  ],
  invalid: [
    // Invalid - importing useResponsiveValue from @primer/react
    {
      code: `import { useResponsiveValue } from '@primer/react'`,
      errors: [
        {
          messageId: 'noUseResponsiveValue',
        },
      ],
    },

    // Invalid - importing with other imports
    {
      code: `import { Button, useResponsiveValue, Box } from '@primer/react'`,
      errors: [
        {
          messageId: 'noUseResponsiveValue',
        },
      ],
    },

    // Invalid - importing as named import with alias
    {
      code: `import { useResponsiveValue as useRV } from '@primer/react'
             function Component() {
               const value = useRV(['sm', 'md'])
               return <div>{value}</div>
             }`,
      errors: [
        {
          messageId: 'noUseResponsiveValue',
        },
      ],
    },

    // Invalid - importing from experimental entrypoint
    {
      code: `import { useResponsiveValue } from '@primer/react/experimental'`,
      errors: [
        {
          messageId: 'noUseResponsiveValue',
        },
      ],
    },

    // Invalid - importing from deprecated entrypoint
    {
      code: `import { useResponsiveValue } from '@primer/react/deprecated'`,
      errors: [
        {
          messageId: 'noUseResponsiveValue',
        },
      ],
    },

    // Invalid - importing from local hooks path
    {
      code: `import { useResponsiveValue } from '../hooks/useResponsiveValue'`,
      errors: [
        {
          messageId: 'noUseResponsiveValue',
        },
      ],
    },

    // Invalid - importing default from local useResponsiveValue file
    {
      code: `import useResponsiveValue from '../hooks/useResponsiveValue'`,
      errors: [
        {
          messageId: 'noUseResponsiveValue',
        },
      ],
    },

    // Invalid - importing from nested path containing useResponsiveValue
    {
      code: `import { useResponsiveValue } from '../../src/hooks/useResponsiveValue'`,
      errors: [
        {
          messageId: 'noUseResponsiveValue',
        },
      ],
    },

    // Invalid - importing from lib path containing useResponsiveValue
    {
      code: `import { useResponsiveValue } from './useResponsiveValue'`,
      errors: [
        {
          messageId: 'noUseResponsiveValue',
        },
      ],
    },
  ],
})
