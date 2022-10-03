import {addons} from '@storybook/addons'
import {withPerformance} from 'storybook-addon-performance'
import {withThemeProvider, toolbarTypes} from '../src/utils/story-helpers'
import '@primer/primitives/tokens-v2-private/css/tokens/base/size/size.css'

export const globalTypes = toolbarTypes
export const decorators = [withThemeProvider, withPerformance]

addons.setConfig({
  // Some stories may set up keyboard event handlers, which can be interfered
  // with by these keyboard shortcuts.
  enableShortcuts: false
})

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  html: {
    root: '#html-addon-root',
    removeEmptyComments: true
  },
  options: {
    storySort: {
      order: ['Components', 'Behaviors', 'Hooks', 'Private components', 'Deprecated components', '*'],
      method: 'alphabetical'
    }
  }
}
