module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-performance/register',
    ...(process.env.NODE_ENV === 'production' ? ['@whitespace/storybook-addon-html'] : [])
  ]
}
