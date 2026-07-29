import type {TSESLint} from '@typescript-eslint/utils'
import {preferMergeProps} from './rules/preferMergeProps.ts'

const plugin: TSESLint.FlatConfig.Plugin = {
  meta: {
    name: '@primer/eslint-config',
  },
  rules: {
    'prefer-merge-props': preferMergeProps,
  },
}

const config: TSESLint.FlatConfig.Config = {
  name: '@primer/eslint-config',
  plugins: {
    primer: plugin,
  },
  rules: {
    'primer/prefer-merge-props': 'off',
  },
}

export {config, plugin, preferMergeProps}
export default config
