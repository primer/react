const rule = require('../enforce-css-module-default-import')
const {RuleTester} = require('eslint')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

ruleTester.run('enforce-css-module-default-import', rule, {
  valid: [
    'import classes from "a.module.css";',
    'import {default as classes} from "a.module.css";',
    'import staticClasses from "a.module.css";',
    'import fooClasses from "a.module.css";',
    'import whatever from "a.js";',
    'import whatever from "a.module.js";',
    'import whatever from "a.css";',
    'import {whatever} from "a.js";',
    'import {whatever} from "a.css";',
    {
      code: 'import classes from "a.module.css";',
      options: [{enforceName: '(?:^classes$|Classes$)'}],
    },
    {
      code: 'import sharedClasses from "a.module.css";',
      options: [{enforceName: '(?:^classes$|Classes$)'}],
    },
  ],
  invalid: [
    {
      code: 'import {foo} from "a.module.css";',
      errors: [
        {
          messageId: 'notDefault',
        },
      ],
    },
    {
      code: 'import _, {foo} from "a.module.css";',
      errors: [
        {
          messageId: 'notDefault',
        },
      ],
    },
    {
      code: 'import foobar from "a.module.css";',
      options: [{enforceName: '(?:^classes$|Classes$)'}],
      errors: [
        {
          messageId: 'badName',
        },
      ],
    },
    {
      code: 'import someclasses from "a.module.css";',
      options: [{enforceName: '(?:^classes$|Classes$)'}],
      errors: [
        {
          messageId: 'badName',
        },
      ],
    },
    {
      code: 'import {default as foobar} from "a.module.css";',
      options: [{enforceName: '(?:^classes$|Classes$)'}],
      errors: [
        {
          messageId: 'badName',
        },
      ],
    },
    {
      code: 'import {default as someclasses} from "a.module.css";',
      options: [{enforceName: '(?:^classes$|Classes$)'}],
      errors: [
        {
          messageId: 'badName',
        },
      ],
    },
  ],
})
