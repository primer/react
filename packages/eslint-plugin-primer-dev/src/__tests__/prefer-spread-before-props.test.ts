import {RuleTester} from 'eslint'
import {describe, test, expect} from 'vitest'
import {rule} from '../rules/prefer-spread-before-props'

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

describe('prefer-spread-before-props', () => {
  test('hello', () => {
    ruleTester.run('prefer-spread-before-props', rule, {
      valid: [
        {
          code: '<ExampleComponent {...props} foo />',
        },
      ],
      invalid: [
        {
          code: '<ExampleComponent foo {...props} />',
          errors: [
            {
              message: 'Spread attributes should be placed before other props',
            },
          ],
        },
      ],
    })
  })
})
