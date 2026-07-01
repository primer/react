const defines = require('./babel-defines.cjs')
const {isSupported} = require('./script/react-compiler.mjs')

function replacementPlugin(env) {
  return ['babel-plugin-transform-replace-expressions', {replace: defines[env]}]
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
  'dev-expression',
  'add-react-displayname',
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-proposal-optional-chaining',
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
