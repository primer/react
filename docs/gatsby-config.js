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
          '@primer/components': path.resolve(__dirname, '../src'),
        }
      }
    }
  ],
  pathPrefix: '/components'
}
