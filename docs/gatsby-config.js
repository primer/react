const path = require('path')

const ROOT_DIR = path.resolve(__dirname, '..')

module.exports = {
  siteMetadata: {
    title: 'Primer React',
    header: {
      title: 'Primer Design System',
    },
    shortName: 'React',
    description: 'React components for the Primer design system',
  },
  plugins: [
    'gatsby-plugin-typescript',
    {
      resolve: '@primer/gatsby-theme-doctocat',
      options: {
        repoRootPath: '..',
        defaultBranch: 'main',
      },
    },
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          '@primer/components': path.resolve(__dirname, '../packages/react/src'),
          '@primer/react': path.resolve(__dirname, '../packages/react/src'),
          '@primer/react/drafts': path.resolve(__dirname, '../packages/react/src/drafts'),
          'styled-components': path.join(ROOT_DIR, 'node_modules', 'styled-components'),
          react: path.join(ROOT_DIR, 'node_modules', 'react'),
        },
      },
    },
  ],
  pathPrefix: '/react',
}
