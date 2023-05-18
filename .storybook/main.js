/**
 * @type {import('@storybook/core-common').StorybookConfig}
 */
module.exports = {
  stories: ['../packages/**/src/**/*.stories.mdx', '../packages/**/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    {name: '@storybook/addon-essentials', options: {backgrounds: false}},
    '@storybook/addon-storysource',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    {
      name: 'storybook-addon-turbo-build',
      options: {
        optimizationLevel: 2,
      },
    },
    {
      name: 'storybook-css-modules', // TODO: replace with @storybook/addon-styling for storybook v7
      options: {cssModulesLoaderOptions: {modules: {localIdentName: 'prc_[local]-[hash:base64:5]'}}},
    },
  ],
  core: {
    builder: {
      name: 'webpack5',
      options: {
        fsCache: true,
      },
    },
  },
  features: {
    interactionsDebugger: true,
    storyStoreV7: true,
    buildStoriesJson: true,
  },
  framework: '@storybook/react',
  reactOptions: {
    fastRefresh: true,
    strictMode: true,
  },
  webpackFinal: config => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          // When switching to Webpack 5, this is no longer included and caused
          // a failure in certain stories. This can be removed when using
          // Storybook v7
          // @see https://github.com/storybookjs/storybook/issues/17458
          assert: require.resolve('assert'),
        },
      },
    }
  },
}
