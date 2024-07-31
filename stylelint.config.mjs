/**
 * @type {import('stylelint').Configuration}
 */
export default {
  extends: ['@primer/stylelint-config'],
  rules: {},
  overrides: [
    {
      files: ['examples/**/*.css'],
      rules: {
        // Examples may intentionally leave css files blank as placeholders
        'no-empty-source': null,
      },
    },
  ],
}
