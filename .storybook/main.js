module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    {name: '@storybook/addon-essentials', options: {backgrounds: false}},
    'storybook-addon-performance/register'
  ],
  babel: options => {
    options.plugins.push(['open-source', {editor: process.env.NODE_ENV === 'production' ? 'github' : 'vscode'}])
    return options
  }
}
