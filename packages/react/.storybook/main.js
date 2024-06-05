import {dirname, join} from 'path'

const {DEPLOY_ENV = 'development'} = process.env

/**
 * @type {import('@storybook/core-common').StorybookConfig}
 */
module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
      },
    },
    getAbsolutePath('@storybook/addon-storysource'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-links'),
    {
      name: 'storybook-addon-turbo-build',
      options: {
        optimizationLevel: 2,
      },
    },
    {
      name: '@storybook/addon-styling',
      options: {
        cssModules: {
          localIdentName: 'prc_[local]-[hash:base64:5]',
        },
        postCss: {
          implementation: require('postcss'),
        },
      },
    },
    '@storybook/addon-webpack5-compiler-babel',
  ],
  features: {
    interactionsDebugger: true,
    // storyStoreV7: true,
    buildStoriesJson: true,
  },
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {
      fastRefresh: true,
      strictMode: true,
      builder: {
        fsCache: true,
      },
    },
  },
  docs: {},
  typescript: {
    reactDocgen: 'react-docgen',
  },
  previewHead: head => {
    if (DEPLOY_ENV === 'development') {
      return head
    }
    return `${head}\n<meta name="ha-url" content="https://collector.githubapp.com/primer/collect">`
  },
  previewBody: body => {
    if (DEPLOY_ENV === 'development') {
      return body
    }
    return `${body}\n<script src="https://analytics.githubassets.com/hydro-marketing.min.js"></script>`
  },
}

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')))
}
