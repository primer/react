import {addons} from '@storybook/addons'
import {withPerformance} from 'storybook-addon-performance'
import {withThemeProvider, toolbarTypes} from '../src/utils/story-helpers'

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
  }
}
