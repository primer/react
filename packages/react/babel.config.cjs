const defines = require('./babel-defines.cjs')

function replacementPlugin(env) {
  return ['babel-plugin-transform-replace-expressions', {replace: defines[env]}]
}

const sharedPlugins = [
  'macros',
  'dev-expression',
  'add-react-displayname',
  '@babel/plugin-transform-nullish-coalescing-operator',
  '@babel/plugin-transform-optional-chaining',
]

function makePresets() {
  return [
    ['@babel/preset-typescript', {onlyRemoveTypeImports: false}],
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
