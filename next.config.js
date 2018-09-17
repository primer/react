const withPlugins = require('next-compose-plugins')
const sass = require('@zeit/next-sass')
const mdx = require('@zeit/next-mdx')({extension: /\.mdx?$/})

module.exports = withPlugins([sass, mdx], {
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
    // we only care about disabling mangling in production
    if (dev) {
      return config
    }
    for (const plugin of config.plugins) {
      // duck type: is this an UglifyJS plugin?
      if (plugin.options && plugin.options.uglifyOptions) {
        console.warn('*** disabling mangling in UglifyJS plugin ***')
        plugin.options.uglifyOptions.mangle = false
      }
    }
    return config
  }
})
