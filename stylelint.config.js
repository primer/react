'use strict'

/**
 * @type {import('stylelint').Config}
 */
module.exports = {
  extends: ['@primer/stylelint-config'],
  rules: {
    'order/properties-order': null,
    'rule-empty-line-before': null,
    'declaration-empty-line-before': null,
    'comment-empty-line-before': null,
    'length-zero-no-unit': null,
    'scss/selector-no-redundant-nesting-selector': null,
    'selector-max-type': null,
    'primer/spacing': null,
    'primer/colors': null,
    'primer/borders': null,
    'primer/typography': null,
    'primer/box-shadow': null,
    'primer/no-deprecated-colors': [
      true,
      {
        inlineFallback: true,
      },
    ],
    // Note: this rule currently uses `globby` under-the-hood which follows the
    // symlinks in this project in an infinite loop. Disable until we can fix
    // this issue upstream or until the project no longer uses symlinks.
    'primer/no-unused-vars': null,
    'primer/no-scale-colors': null,
    'primer/utilities': null,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['@container', 'container-type'],
      },
    ],
    'scss/at-rule-no-unknown': null,
    'primer/no-override': null,
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      customSyntax: 'postcss-styled-syntax',
    },
  ],
}
