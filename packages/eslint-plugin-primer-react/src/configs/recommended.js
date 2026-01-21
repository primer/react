const {jsxA11yMapping, githubMapping} = require('./components')

module.exports = {
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['primer-react', 'github'],
  extends: ['plugin:github/react'],
  rules: {
    'primer-react/direct-slot-children': 'error',
    'primer-react/no-system-props': 'warn',
    'primer-react/no-deprecated-experimental-components': 'warn',
    'primer-react/a11y-tooltip-interactive-trigger': 'error',
    'primer-react/new-color-css-vars': 'error',
    'primer-react/a11y-explicit-heading': 'error',
    'primer-react/a11y-no-title-usage': 'error',
    'primer-react/a11y-no-duplicate-form-labels': 'error',
    'primer-react/no-deprecated-props': 'warn',
    'primer-react/a11y-remove-disable-tooltip': 'error',
    'primer-react/a11y-use-accessible-tooltip': 'error',
    'primer-react/no-unnecessary-components': 'error',
    'primer-react/prefer-action-list-item-onselect': 'error',
    'primer-react/no-use-responsive-value': 'error',
  },
  settings: {
    github: {
      components: githubMapping,
    },
    'jsx-a11y': {
      components: jsxA11yMapping,
    },
  },
}
