const withPlugins = require('next-compose-plugins')
const sass = require('@zeit/next-sass')
const mdx = require('@zeit/next-mdx')({extension: /\.mdx?$/})

module.exports = withPlugins([sass, mdx], {
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  sassLoaderOptions: {
    includePaths: ['node_modules']
  }
})
