const withPlugins = require('next-compose-plugins')
const mdx = require('@zeit/next-mdx')

module.exports = withPlugins([
  mdx({extension: /\.mdx?$/})
], {
  /*
   * Note: Prefixing assets with the fully qualified deployment URL
   * makes them available even when the site is served from a path alias, as in
   * <https://primer.style/components>
   */
  assetPrefix: process.env.NOW_URL,
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  sassLoaderOptions: {
    includePaths: ['node_modules']
  },

  webpack(config, {dev}) {
    // load primer-components.css as raw
    config.module.rules.push({
      test: /\.css$/,
      use: 'raw-loader'
    })

    // we only care about disabling mangling in production
    if (dev) {
      return config
    }
    for (const plugin of config.plugins) {
      // duck type: is this an UglifyJS plugin?
      if (plugin.options && plugin.options.uglifyOptions) {
        /* eslint-disable camelcase, no-console */
        console.warn('*** disabling mangling in UglifyJS plugin ***')
        plugin.options.uglifyOptions.compress = {keep_fnames: true}
        plugin.options.uglifyOptions.mangle.keep_fnames = true
        /* eslint-enable camelcase, no-console */
      }
    }
    return config
  }
})
