const defines = require('./babel-defines')

function replacementPlugin(env) {
  return ['babel-plugin-transform-replace-expressions', {replace: defines[env]}]
}

const sharedPlugins = [
  'macros',
  'preval',
  'add-react-displayname',
  'babel-plugin-styled-components',
  '@babel/plugin-proposal-object-rest-spread'
]

const runtimePlugins = [['@babel/plugin-transform-runtime', {version: '7.9.2', helpers: true}]]

function makePresets(moduleValue) {
  return [
    ['@babel/preset-react', {modules: moduleValue}],
    ['@babel/preset-env', {modules: moduleValue}]
  ]
}

module.exports = {
  env: {
    development: {
      presets: makePresets(process.env.BABEL_MODULE || false),
      plugins: [...sharedPlugins, ...runtimePlugins, replacementPlugin('development')]
    },
    production: {
      presets: makePresets(false),
      plugins: [...sharedPlugins, ...runtimePlugins, replacementPlugin('production')]
    },
    test: {
      presets: makePresets('commonjs'),
      plugins: [...sharedPlugins, replacementPlugin('test')]
    }
  }
}
