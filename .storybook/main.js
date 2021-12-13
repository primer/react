module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-performance/register'
  ],
  webpackFinal: async (config, {configType}) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.resolve.push({
      alias: {
        ...config.module.resolve.alias,
        'react-dom': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling'
      }
    })

    // Return the altered config
    return config
  }
}
