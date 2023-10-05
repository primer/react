module.exports = {
  extends: ['@primer/stylelint-config'],
  customSyntax: 'postcss-styled-syntax',
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
}
