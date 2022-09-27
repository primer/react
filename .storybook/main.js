module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    {name: '@storybook/addon-essentials', options: {backgrounds: false}},
    {name: 'storybook-addon-turbo-build', options: {optimizationLevel: 2}}
  ],
  babel: options => {
    options.plugins.push(['open-source', {editor: process.env.NODE_ENV === 'production' ? 'github' : 'vscode'}])
    return options
  },
  features: {
    interactionsDebugger: true
  }
}
