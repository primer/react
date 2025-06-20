import {RuleTester} from 'eslint'
import {test} from 'vitest'
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

test('prefer-spread-before-props', () => {
  ruleTester.run('prefer-spread-before-props', rule, {
    valid: [
      {
        code: '<ExampleComponent {...props} foo />',
      },
    ],
    invalid: [
      {
        code: '<ExampleComponent foo {...props} />',
        output: '<ExampleComponent {...props} foo />',
        errors: [
          {
            messageId: 'spreadBeforeProps',
          },
        ],
      },
    ],
  })
})
