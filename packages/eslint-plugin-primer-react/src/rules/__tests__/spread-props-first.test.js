const rule = require('../spread-props-first')
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

ruleTester.run('spread-props-first', rule, {
  valid: [
    // Spread props before named props
    `<Example {...rest} className="foo" />`,
    // Multiple spreads before named props
    `<Example {...rest} {...other} className="foo" id="bar" />`,
    // Only spread props
    `<Example {...rest} />`,
    // Only named props
    `<Example className="foo" id="bar" />`,
    // Empty element
    `<Example />`,
    // Spread first, then named props
    `<Example {...rest} className="foo" onClick={handleClick} />`,
    // Multiple spreads at the beginning
    `<Example {...props1} {...props2} {...props3} className="foo" />`,
  ],
  invalid: [
    // Named prop before spread
    {
      code: `<Example className="foo" {...rest} />`,
      output: `<Example {...rest} className="foo" />`,
      errors: [
        {
          messageId: 'spreadPropsFirst',
          data: {spreadProp: '{...rest}', namedProp: 'className'},
        },
      ],
    },
    // Multiple named props before spread
    {
      code: `<Example className="foo" id="bar" {...rest} />`,
      output: `<Example {...rest} className="foo" id="bar" />`,
      errors: [
        {
          messageId: 'spreadPropsFirst',
          data: {spreadProp: '{...rest}', namedProp: 'id'},
        },
      ],
    },
    // Named prop with expression before spread
    {
      code: `<Example onClick={handleClick} {...rest} />`,
      output: `<Example {...rest} onClick={handleClick} />`,
      errors: [
        {
          messageId: 'spreadPropsFirst',
          data: {spreadProp: '{...rest}', namedProp: 'onClick'},
        },
      ],
    },
    // Mixed order with multiple spreads
    {
      code: `<Example className="foo" {...rest} id="bar" {...other} />`,
      output: `<Example {...rest} {...other} className="foo" id="bar" />`,
      errors: [
        {
          messageId: 'spreadPropsFirst',
          data: {spreadProp: '{...rest}', namedProp: 'id'},
        },
      ],
    },
    // Named prop before multiple spreads
    {
      code: `<Example className="foo" {...rest} {...other} />`,
      output: `<Example {...rest} {...other} className="foo" />`,
      errors: [
        {
          messageId: 'spreadPropsFirst',
          data: {spreadProp: '{...rest}', namedProp: 'className'},
        },
      ],
    },
    // Complex example with many props
    {
      code: `<Example className="foo" id="bar" onClick={handleClick} {...rest} disabled />`,
      output: `<Example {...rest} className="foo" id="bar" onClick={handleClick} disabled />`,
      errors: [
        {
          messageId: 'spreadPropsFirst',
          data: {spreadProp: '{...rest}', namedProp: 'disabled'},
        },
      ],
    },
    // Boolean prop before spread
    {
      code: `<Example disabled {...rest} />`,
      output: `<Example {...rest} disabled />`,
      errors: [
        {
          messageId: 'spreadPropsFirst',
          data: {spreadProp: '{...rest}', namedProp: 'disabled'},
        },
      ],
    },
    // Spread in the middle
    {
      code: `<Example className="foo" {...rest} id="bar" />`,
      output: `<Example {...rest} className="foo" id="bar" />`,
      errors: [
        {
          messageId: 'spreadPropsFirst',
          data: {spreadProp: '{...rest}', namedProp: 'id'},
        },
      ],
    },
  ],
})
