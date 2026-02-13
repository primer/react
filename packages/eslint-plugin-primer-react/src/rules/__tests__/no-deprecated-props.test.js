'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-deprecated-props')

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

ruleTester.run('no-deprecated-props', rule, {
  valid: [
    `import {ActionList} from '@primer/react';
    <ActionList>
        <ActionList.Group>
            <ActionList.GroupHeading as="h3">Group heading 1</ActionList.GroupHeading>
            <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
        <ActionList.Group>
            <ActionList.GroupHeading as="h3">Group heading 2</ActionList.GroupHeading>
            <ActionList.Item>Item 2</ActionList.Item>
        </ActionList.Group>
    </ActionList>`,
    `import {ActionList} from '@primer/react';
    <ActionList>
        <ActionList.Group>
            <ActionList.GroupHeading>Group heading 1</ActionList.GroupHeading>
            <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
        <ActionList.Group>
            <ActionList.GroupHeading>Group heading 2</ActionList.GroupHeading>
            <ActionList.Item>Item 2</ActionList.Item>
        </ActionList.Group>
    </ActionList>`,
    `import {ActionList} from '@primer/react';
    <ActionList>
        <ActionList.Group>
            <ActionList.GroupHeading as="h3">Group heading</ActionList.GroupHeading>
            <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
        <ActionList.Item>Item 2</ActionList.Item>
    </ActionList>`,
    `import {ActionList} from '@primer/react';
    <ActionList role="listbox">
        <ActionList.Group>
            <ActionList.GroupHeading>Group heading</ActionList.GroupHeading>
            <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
        <ActionList.Item>Item 2</ActionList.Item>
    </ActionList>`,
    `import {ActionList} from '@primer/react';
    <ActionList role="menu">
        <ActionList.Item>Item</ActionList.Item>
        <ActionList.Group>
            <ActionList.GroupHeading>Group heading</ActionList.GroupHeading>
            <ActionList.Item>Group item</ActionList.Item>
        </ActionList.Group>
    </ActionList>`,
  ],
  invalid: [
    {
      code: `<ActionList.Group title="Group heading 1"></ActionList.Group>`,
      output: `<ActionList.Group><ActionList.GroupHeading>Group heading 1</ActionList.GroupHeading></ActionList.Group>`,
      errors: [
        {
          messageId: 'titlePropDeprecated',
        },
      ],
    },
    {
      code: `<ActionList.Group title="Group heading 1" sx={{padding: 2}}></ActionList.Group>`,
      output: `<ActionList.Group sx={{padding: 2}}><ActionList.GroupHeading>Group heading 1</ActionList.GroupHeading></ActionList.Group>`,
      errors: [
        {
          messageId: 'titlePropDeprecated',
        },
      ],
    },
    {
      code: `<ActionList.Group variant="filled" title="Group heading 1"></ActionList.Group>`,
      output: `<ActionList.Group variant="filled"><ActionList.GroupHeading>Group heading 1</ActionList.GroupHeading></ActionList.Group>`,
      errors: [
        {
          messageId: 'titlePropDeprecated',
        },
      ],
    },
    {
      code: `<ActionList.Group title={titleVariable}></ActionList.Group>`,
      output: `<ActionList.Group><ActionList.GroupHeading>{titleVariable}</ActionList.GroupHeading></ActionList.Group>`,
      errors: [
        {
          messageId: 'titlePropDeprecated',
        },
      ],
    },
    {
      code: `<ActionList.Group title={'Title'}></ActionList.Group>`,
      output: `<ActionList.Group><ActionList.GroupHeading>{'Title'}</ActionList.GroupHeading></ActionList.Group>`,
      errors: [
        {
          messageId: 'titlePropDeprecated',
        },
      ],
    },
    {
      code: `<ActionList.Group title={condition ? 'Title' : undefined}></ActionList.Group>`,
      output: `<ActionList.Group><ActionList.GroupHeading>{condition ? 'Title' : undefined}</ActionList.GroupHeading></ActionList.Group>`,
      errors: [
        {
          messageId: 'titlePropDeprecated',
        },
      ],
    },
  ],
})
