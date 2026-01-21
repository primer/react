# eslint-plugin-primer-react

[![npm package](https://img.shields.io/npm/v/eslint-plugin-primer-react.svg)](https://www.npmjs.com/package/eslint-plugin-primer-react)

ESLint rules for Primer React

## Installation

1. Assuming you already have [ESLint](https://www.npmjs.com/package/eslint) and
   [Primer React](https://github.com/primer/react) installed, run:

   ```shell
   npm install --save-dev eslint-plugin-primer-react

   # or

   yarn add --dev eslint-plugin-primer-react
   ```

2. In your [ESLint configuration file](https://eslint.org/docs/user-guide/configuring/configuration-files), extend the
   recommended Primer React ESLint config:

   ```js
   {
     "extends": [
       // ...
       "plugin:primer-react/recommended"
     ]
   }
   ```

## Rules

- [a11y-explicit-heading](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/a11y-explicit-heading.md)
- [a11y-link-in-text-block](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/a11y-link-in-text-block.md)
- [a11y-no-duplicate-form-labels](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/a11y-no-duplicate-form-labels.md)
- [a11y-no-title-usage](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/a11y-no-title-usage.md)
- [a11y-remove-disable-tooltip](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/a11y-remove-disable-tooltip.md)
- [a11y-tooltip-interactive-trigger](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/a11y-tooltip-interactive-trigger.md)
- [a11y-use-accessible-tooltip](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/a11y-use-accessible-tooltip.md)
- [direct-slot-children](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/direct-slot-children.md)
- [enforce-button-for-link-with-no-href](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/enforce-button-for-link-with-no-href.md)
- [enforce-css-module-default-import](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/enforce-css-module-default-import.md)
- [enforce-css-module-identifier-casing](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/enforce-css-module-identifier-casing.md)
- [new-color-css-vars](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/new-color-css-vars.md)
- [no-deprecated-entrypoints](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/no-deprecated-entrypoints.md)
- [no-deprecated-experimental-components](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/no-deprecated-experimental-components.md)
- [no-deprecated-props](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/no-deprecated-props.md)
- [no-system-props](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/no-system-props.md)
- [no-unnecessary-components](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/no-unnecessary-components.md)
- [no-use-responsive-value](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/no-use-responsive-value.md)
- [no-wildcard-imports](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/no-wildcard-imports.md)
- [prefer-action-list-item-onselect](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/prefer-action-list-item-onselect.md)
- [spread-props-first](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/spread-props-first.md)
- [use-deprecated-from-deprecated](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/use-deprecated-from-deprecated.md)
- [use-styled-react-import](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/use-styled-react-import.md)
