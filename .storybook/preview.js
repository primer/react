import {addons} from '@storybook/addons'

addons.setConfig({
  // Some stories may set up keyboard event handlers, which can can be interfered
  // with by these keyboard shortcuts.
  enableShortcuts: false
})

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'}
}
