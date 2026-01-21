const rule = require('../a11y-no-title-usage')
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

ruleTester.run('a11y-no-title-usage', rule, {
  valid: [
    `<RelativeTime date={new Date('2020-01-01T00:00:00Z')} noTitle={true} />`,
    `<RelativeTime date={new Date('2020-01-01T00:00:00Z')} noTitle />`,
    `<RelativeTime date={new Date('2020-01-01T00:00:00Z')} />`,
  ],
  invalid: [
    {
      code: `<RelativeTime date={new Date('2020-01-01T00:00:00Z')} noTitle={false} />`,
      output: `<RelativeTime date={new Date('2020-01-01T00:00:00Z')} />`,
      errors: [{messageId: 'noTitleOnRelativeTime'}],
    },
  ],
})
