const defines = require('./babel-defines')

function replacementPlugin(env) {
  return ['babel-plugin-transform-replace-expressions', {replace: defines[env]}]
}

const sharedPlugins = ['macros', 'preval', 'add-react-displayname', 'babel-plugin-styled-components', '@babel/plugin-proposal-nullish-coalescing-operator']

function makePresets(moduleValue) {
  return [['@babel/preset-react', {modules: moduleValue}]]
}

module.exports = {
  env: {
    development: {
      presets: makePresets(process.env.BABEL_MODULE || false),
      plugins: [...sharedPlugins, replacementPlugin('development')]
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
