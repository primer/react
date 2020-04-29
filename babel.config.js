const sharedPlugins = [
  'macros',
  'add-react-displayname',
  'babel-plugin-styled-components',
  '@babel/plugin-proposal-object-rest-spread'
]

const devPlugins = [
  [
    '@babel/plugin-transform-runtime',
    {
      version: '7.9.2',
      helpers: true
    }
  ]
]

function makePresets(moduleValue) {
  return [
    ['@babel/preset-react', {modules: moduleValue}],
    ['@babel/preset-env', {modules: moduleValue}]
  ]
}

module.exports = {
  env: {
    development: {
      presets: makePresets('commonjs'),
      plugins: sharedPlugins.concat(devPlugins)
    },
    production: {
      presets: makePresets(false),
      plugins: sharedPlugins
    },
    test: {
      presets: makePresets('commonjs'),
      plugins: sharedPlugins
    }
  }
}
