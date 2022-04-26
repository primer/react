export * from '@primer/react-scripts/storybook/preview'

// additional parameters for addons
export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},

  // for @whitespace/storybook-addon-html,
  html: {
    root: '#html-addon-root',
    removeEmptyComments: true
  }
}
