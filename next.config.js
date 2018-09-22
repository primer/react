const withPlugins = require('next-compose-plugins')
const mdx = require('@zeit/next-mdx')

module.exports = withPlugins([
  mdx({extension: /\.mdx?$/})
], {
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],

  publicRuntimeConfig: {
    assetPrefix: process.env.NOW_URL
  },

  webpack(config) {
    // load primer-components.css as raw string
    config.module.rules.push({
      test: /\.css$/,
      use: 'raw-loader'
    })

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
