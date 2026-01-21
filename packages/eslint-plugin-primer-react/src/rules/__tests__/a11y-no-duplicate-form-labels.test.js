const rule = require('../a11y-no-duplicate-form-labels')
const {RuleTester} = require('eslint')

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

ruleTester.run('a11y-no-duplicate-form-labels', rule, {
  valid: [
    // TextInput without aria-label is valid
    `import {FormControl, TextInput} from '@primer/react';
    <FormControl>
      <FormControl.Label>Form Input Label</FormControl.Label>
      <TextInput />
    </FormControl>`,

    // TextInput with aria-label but no FormControl.Label is valid
    `import {FormControl, TextInput} from '@primer/react';
    <FormControl>
      <TextInput aria-label="Form Input Label" />
    </FormControl>`,

    // TextInput with aria-label outside FormControl is valid
    `import {TextInput} from '@primer/react';
    <TextInput aria-label="Form Input Label" />`,

    // TextInput with visuallyHidden FormControl.Label is valid
    `import {FormControl, TextInput} from '@primer/react';
    <FormControl>
      <FormControl.Label visuallyHidden>Form Input Label</FormControl.Label>
      <TextInput />
    </FormControl>`,

    // Multiple TextInputs with different approaches
    `import {FormControl, TextInput} from '@primer/react';
    <div>
      <FormControl>
        <FormControl.Label>Visible Label</FormControl.Label>
        <TextInput />
      </FormControl>
      <FormControl>
        <TextInput aria-label="Standalone Input" />
      </FormControl>
    </div>`,
  ],
  invalid: [
    {
      code: `import {FormControl, TextInput} from '@primer/react';
      <FormControl>
        <FormControl.Label>Form Input Label</FormControl.Label>
        <TextInput aria-label="Form Input Label" />
      </FormControl>`,
      errors: [
        {
          messageId: 'duplicateLabel',
        },
      ],
    },
    {
      code: `import {FormControl, TextInput} from '@primer/react';
      <FormControl>
        <FormControl.Label>Username</FormControl.Label>
        <TextInput aria-label="Enter your username" />
      </FormControl>`,
      errors: [
        {
          messageId: 'duplicateLabel',
        },
      ],
    },
    {
      code: `import {FormControl, TextInput} from '@primer/react';
      <FormControl>
        <FormControl.Label visuallyHidden>Password</FormControl.Label>
        <TextInput aria-label="Enter password" />
      </FormControl>`,
      errors: [
        {
          messageId: 'duplicateLabel',
        },
      ],
    },
    {
      code: `import {FormControl, TextInput} from '@primer/react';
      <div>
        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <div>
            <TextInput aria-label="Email address" />
          </div>
        </FormControl>
      </div>`,
      errors: [
        {
          messageId: 'duplicateLabel',
        },
      ],
    },
  ],
})
