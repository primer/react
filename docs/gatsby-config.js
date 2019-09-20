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
        modules: [path.resolve(__dirname, '../src'), 'node_modules'],
        extensions: []
      }
    }
  ],
  pathPrefix: '/components'
}
