export * from '@primer/react-scripts/storybook/preview'

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},

  // for @whitespace/storybook-addon-html,
  html: {
    root: '#html-addon-root',
    removeEmptyComments: true
  }
}
