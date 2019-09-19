const path = require('path')

module.exports = {
  siteMetadata: {
    title: 'Primer Components',
    shortName: 'Components',
    description: 'React components for the Primer design system'
  },
  plugins: [
    {
      resolve: '@primer/gatsby-theme-doctocat',
      options: {
        repoRootPath: '..',
      },
    },
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          "@primer/components": process.env.NODE_ENV === 'production' ? 'node_modules/@primer/components' : path.resolve(__dirname, '../src')
        },
        extensions: []
      }
    }
  ],
  pathPrefix: '/components'
}
