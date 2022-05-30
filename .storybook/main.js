module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    {name: '@storybook/addon-essentials', options: {backgrounds: false}},
    'storybook-addon-performance/register',
    {name: 'storybook-addon-turbo-build', options: {optimizationLevel: 2}},
    ...(process.env.NODE_ENV === 'production' && process.env.GITHUB_JOB !== 'chromatic'
      ? ['@whitespace/storybook-addon-html']
      : [])
  ],
  babel: options => {
    options.plugins.push(['open-source', {editor: process.env.NODE_ENV === 'production' ? 'github' : 'vscode'}])
    return options
  }
}
