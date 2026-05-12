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
    // :has() can cause severe perf issues in Safari (quadratic style invalidation).
    // See github/github-ui#17224 for audit. Existing usages are audited and scoped.
    // New usages must be explicitly approved and marked with a stylelint-disable comment.
    'selector-pseudo-class-disallowed-list': [
      ['has'],
      {
        severity: 'error',
        message:
          ':has() selectors can cause severe Safari performance issues (github/github-ui#17224). Verify the selector is scoped (CSS Modules) and does not match broadly, then add a scoped stylelint disable (e.g. "stylelint-disable-next-line" or a minimal "stylelint-disable"/"stylelint-enable" block), not a file-level disable.',
      },
    ],
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
