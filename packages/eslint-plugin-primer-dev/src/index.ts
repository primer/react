import {rule as preferSpreadBeforeProps} from './rules/prefer-spread-before-props.ts'

const plugin = {
  meta: 'eslint-plugin-primer-dev',
  rules: {
    'prefer-spread-before-props': preferSpreadBeforeProps,
  },
  configs: {},
}

Object.assign(plugin.configs, {
  recommended: [
    {
      plugins: {
        'primer-dev': plugin,
      },
      rules: {
        'primer-dev/prefer-spread-before-props': 'error',
      },
    },
  ],
})

export default plugin
