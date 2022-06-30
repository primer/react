const defines = require('./babel-defines')

function replacementPlugin(env) {
  return ['babel-plugin-transform-replace-expressions', {replace: defines[env]}]
}

const sharedPlugins = [
  'macros',
  'preval',
  'add-react-displayname',
  'babel-plugin-styled-components',
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-proposal-optional-chaining'
]

function makePresets(moduleValue) {
  return ['@babel/preset-typescript', ['@babel/preset-react', {modules: moduleValue}]]
}

module.exports = {
  env: {
    development: {
      presets: makePresets(process.env.BABEL_MODULE || false),
      plugins: [
        ...(process.env.BABEL_MODULE === 'commonjs'
          ? ['@babel/plugin-transform-modules-commonjs']
          : [
              'transform-commonjs' // theme-preval is commonjs and needs to be transformed to esm
            ]),
        ...sharedPlugins,
        replacementPlugin('development')
      ]
    },
    production: {
      presets: makePresets(false),
      plugins: [...sharedPlugins, replacementPlugin('production')]
    },
    test: {
      presets: makePresets('commonjs'),
      plugins: [...sharedPlugins, ['@babel/plugin-transform-modules-commonjs'], replacementPlugin('test')]
    }
  }
}
