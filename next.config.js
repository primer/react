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
  }
})
