const defines = require('./babel-defines.cjs')
const {isSupported} = require('./script/react-compiler.mjs')
const devExpressionPlugin = require.resolve('./script/babel-plugins/dev-expression.cjs')
const replaceExpressionsPlugin = require.resolve('./script/babel-plugins/replace-expressions.cjs')

function replacementPlugin(env) {
  return [replaceExpressionsPlugin, {replace: defines[env]}]
}

const sharedPlugins = [
  [
    'babel-plugin-react-compiler',
    {
      target: '18',
      sources: isSupported,
    },
  ],
  'macros',
  devExpressionPlugin,
  'add-react-displayname',
  '@babel/plugin-transform-nullish-coalescing-operator',
  '@babel/plugin-transform-optional-chaining',
]

function makePresets() {
  return [
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ]
}

module.exports = {
  env: {
    development: {
      presets: makePresets(),
      plugins: [...sharedPlugins, replacementPlugin('development')],
    },
    production: {
      presets: makePresets(),
      plugins: [...sharedPlugins, replacementPlugin('production')],
    },
    test: {
      presets: makePresets(),
      plugins: [...sharedPlugins, ['@babel/plugin-transform-modules-commonjs'], replacementPlugin('test')],
    },
  },
}
