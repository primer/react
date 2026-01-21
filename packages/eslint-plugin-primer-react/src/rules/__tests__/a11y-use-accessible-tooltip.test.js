const rule = require('../a11y-use-accessible-tooltip')
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

ruleTester.run('a11y-use-accessible-tooltip', rule, {
  valid: [`import {Tooltip} from '@primer/react';`],
  invalid: [
    // Single import from deprecated
    {
      code: `import {Tooltip} from '@primer/react/deprecated';`,
      errors: [{messageId: 'useAccessibleTooltip'}],
      output: `import {Tooltip} from '@primer/react';`,
    },
    // Multiple imports from deprecated
    {
      code: `import {Tooltip, Button} from '@primer/react/deprecated';`,
      errors: [{messageId: 'useAccessibleTooltip'}],
      output: `import {Button} from '@primer/react/deprecated';\nimport {Tooltip} from '@primer/react';`,
    },
    // Multiple imports from deprecated
    {
      code: `import {Button, Tooltip, Stack} from '@primer/react/deprecated';`,
      errors: [{messageId: 'useAccessibleTooltip'}],
      output: `import {Button, Stack} from '@primer/react/deprecated';\nimport {Tooltip} from '@primer/react';`,
    },
    // Single import from deprecated with an existing import from @primer/react
    {
      code: `import {Tooltip} from '@primer/react/deprecated';import {ActionList, ActionMenu} from '@primer/react';`,
      errors: [{messageId: 'useAccessibleTooltip', line: 1}],
      output: `import {ActionList, ActionMenu, Tooltip} from '@primer/react';`,
    },
    // Multiple imports from deprecated with an existing import from @primer/react
    {
      code: `import {Dialog, Tooltip} from '@primer/react/deprecated';import {ActionList, ActionMenu} from '@primer/react';`,
      errors: [{messageId: 'useAccessibleTooltip', line: 1}],
      output: `import {Dialog} from '@primer/react/deprecated';import {ActionList, ActionMenu, Tooltip} from '@primer/react';`,
    },
    {
      code: `import {ActionList, ActionMenu, Tooltip, Button} from '@primer/react/deprecated';\n<Tooltip aria-label="tooltip text" noDelay={true} wrap={true} align="left"><Button>Button</Button></Tooltip>`,
      errors: [
        {messageId: 'useAccessibleTooltip', line: 1},
        {messageId: 'useTextProp', line: 2},
        {messageId: 'noDelayRemoved', line: 2},
        {messageId: 'wrapRemoved', line: 2},
        {messageId: 'alignRemoved', line: 2},
      ],
      output: `import {ActionList, ActionMenu, Button} from '@primer/react/deprecated';\nimport {Tooltip} from '@primer/react';\n<Tooltip text="tooltip text"   ><Button>Button</Button></Tooltip>`,
    },
  ],
})
