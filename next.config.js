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
  }
})
