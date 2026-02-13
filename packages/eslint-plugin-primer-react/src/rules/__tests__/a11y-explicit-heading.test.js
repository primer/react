const rule = require('../a11y-explicit-heading')
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

ruleTester.run('a11y-explicit-heading', rule, {
  valid: [
    `import {Heading} from '@primer/react';
  <Heading as="h1">Heading level 1</Heading>
  `,
    `import {Heading} from '@primer/react';
  <Heading as="h2">Heading level 2</Heading>
  `,
    `import {Heading} from '@primer/react';
  <Heading as="H3">Heading level 3</Heading>
  `,
    `import {Heading} from '@primer/react';
  const args = {};
  <Heading {...args}>A heading with spread props</Heading>
  `,
    `import {Heading} from '@primer/react';
  const as = 'h3';
  <Heading as={as}>Heading as passed prop</Heading>
  `,
    `import {Heading} from '@primer/react';
  const args = {};
  <Heading as="h2" {...args}>Heading level 2</Heading>
  `,
    `
  import {Heading} from '@primer/react';
  <Heading
    {...someProps}
    as="h3"
  >
    Passed spread props
  </Heading>
  `,
  ],
  invalid: [
    {
      code: `import {Heading} from '@primer/react';
    <Heading>Heading without "as"</Heading>`,
      errors: [{messageId: 'nonExplicitHeadingLevel'}],
    },
    {
      code: `import {Heading} from '@primer/react';
    <Heading as="span">Heading component used as "span"</Heading>
    `,
      errors: [{messageId: 'invalidAsValue'}],
    },
  ],
})
