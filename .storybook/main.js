/**
 * @type {import('@storybook/core-common').StorybookConfig}
 */
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    {name: '@storybook/addon-essentials', options: {backgrounds: false}},
    '@storybook/addon-storysource',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    {
      name: 'storybook-addon-turbo-build',
      options: {
        optimizationLevel: 2
      }
    },
    ...(process.env.NODE_ENV === 'production' && process.env.GITHUB_JOB !== 'chromatic'
      ? ['@whitespace/storybook-addon-html']
      : [])
  ],
  core: {
    builder: {
      name: 'webpack5',
      options: {
        lazyCompilation: true,
        fsCache: true
      }
    }
  },
  features: {
    interactionsDebugger: true,
    storyStoreV7: true,
    buildStoriesJson: true
  },
  framework: '@storybook/react',
  reactOptions: {
    fastRefresh: true,
    strictMode: true
  }
}
