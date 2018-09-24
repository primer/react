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

  webpack(config) {
    const {optimization} = config
    if (optimization && Array.isArray(optimization.minimizer)) {
      const terserPlugin = optimization.minimizer[0]
      /* eslint-disable camelcase, no-console */
      console.warn('*** disabling function mangling in Terser plugin ***')
      terserPlugin.options.terserOptions = {
        keep_fnames: true
      }
      /* eslint-enable camelcase, no-console */
    }
    return config
  }
})
