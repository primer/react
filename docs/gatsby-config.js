const path = require('path')

module.exports = {
  siteMetadata: {
    title: 'Primer React',
    shortName: 'React',
    description: 'React components for the Primer design system'
  },
  plugins: [
    'gatsby-plugin-typescript',
    {
      resolve: '@primer/gatsby-theme-doctocat',
      options: {
        repoRootPath: '..',
        defaultBranch: 'main'
      },
    },
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          '@primer/components': path.resolve(__dirname, '../src'),
          'styled-components': path.resolve(__dirname, '..', 'node_modules', 'styled-components'),
          'react': path.resolve(__dirname, 'node_modules', 'react'),
        }
      }
    }
  ],
  pathPrefix: '/components'
}
