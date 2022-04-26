const path = require('path')
const defaultConfig = require('@primer/react-scripts/storybook/main')

module.exports = {
  ...defaultConfig,
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    ...defaultConfig.addons,
    ...(process.env.NODE_ENV === 'production' && process.env.GITHUB_JOB !== 'chromatic'
      ? ['@whitespace/storybook-addon-html']
      : [])
  ],
  webpackFinal: config => {
    // we alias node_modules/@primer/react for storybook to use local version instead
    config.resolve.alias['@primer/react/lib-esm'] = path.resolve(__dirname, '../src')
    return config
  },
  babel: options => {
    options.plugins.push(['open-source', {editor: process.env.NODE_ENV === 'production' ? 'github' : 'vscode'}])
    return options
  }
}
