/**
 * @type {import('stylelint').Configuration}
 */
export default {
  extends: ['@primer/stylelint-config'],
  rules: {
    // We want to allow type selectors like `svg`
    'selector-max-type': 1,
    'selector-class-pattern': [
      '^(focus-visible|[A-Z][a-zA-Z0-9]+(__[a-z]+(-[a-z]+)*)?(--[a-z]+(-[a-z]+)*)?)$',
      {
        resolveNestedSelectors: true,
        message: '"%s" selector should be written in PascalCase or BEM format (e.g. block__element--modifier)',
      },
    ],
    'layer-name-pattern': '^[a-z][a-zA-Z0-9.-]*$',
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
