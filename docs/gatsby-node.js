exports.onCreateWebpackConfig = ({actions, plugins, loaders, getConfig}) => {
  const config = getConfig()

  config.module.rules = [
    ...config.module.rules,
    // Create a custom configuration.
    {
      // The new configuration is based off the original...
      ...loaders.js(),
      test: /\.jsx?$/,
      exclude: modulePath => /node_modules/.test(modulePath),
      // ...except that we want to run Primer React through webpack as well.
      // By default, Gatsby won't use the define plugin we added above on Primer React.
      include: modulePath => /@primer\/components/.test(modulePath)
    }
  ]
  actions.replaceWebpackConfig(config)
}
