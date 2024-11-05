/**
 * @type {import('stylelint').Configuration}
 */
export default {
  extends: ['@primer/stylelint-config'],
  rules: {
    // We want to allow type selectors like `svg`
    'selector-max-type': 1,
  },
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
