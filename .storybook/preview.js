/**
 * primer/react uses a special preview.js which is a subset of the recommended preview.js.
 * We do this so that we can use local withThemeProvider instead of node_modules
 */

// export default config
export * from '@primer/react-scripts/storybook/preview-primer-react'

import {withThemeProvider, toolbarTypes} from '../src/utils/story-helpers'
import {decorators} from '@primer/react-scripts/storybook/preview-primer-react'

export const globalTypes = toolbarTypes
decorators.push(withThemeProvider)
export {decorators}

// additional parameters for addons
export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},

  // for @whitespace/storybook-addon-html,
  html: {
    root: '#html-addon-root',
    removeEmptyComments: true
  }
}
