import {addons} from '@storybook/addons'

export * from '@primer/react-scripts/storybook/preview'

addons.setConfig({
  // Some stories may set up keyboard event handlers, which can be interfered
  // with by these keyboard shortcuts.
  enableShortcuts: false
})

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  // @whitespace/storybook-addon-html
  html: {
    root: '#html-addon-root',
    removeEmptyComments: true
  }
}
