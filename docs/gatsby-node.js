const defines = require('../babel-defines')

exports.onCreateWebpackConfig = ({actions, plugins, loaders, getConfig}) => {
  const config = getConfig()
  // Add our `__DEV__` and `process.env.NODE_ENV` defines
  config.plugins.push(plugins.define(defines[process.env.NODE_ENV || 'development']))

  config.module.rules = [
    // Remove the original rule that compiles `.js`. and `.jsx` files...
    ...config.module.rules.filter(rule => String(rule.test) !== String(/\.jsx?$/)),
    // ...and replace it with a custom configuration.
    {
      // The new configuration is based off the original...
      ...loaders.js(),
      test: /\.jsx?$/,
      exclude: modulePath => /node_modules/.test(modulePath),
      // ...except that we want to run Primer Components through webpack as well.
      // By default, Gatsby won't use the define plugin we added above on Primer Components.
      include: modulePath => /@primer\/components/.test(modulePath)
    }
  ]
  actions.replaceWebpackConfig(config)
}
