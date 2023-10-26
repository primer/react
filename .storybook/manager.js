import {addons, types} from '@storybook/addons'
import {Tool, TOOL_ID, ADDON_ID} from './src/accessibility-tool'
import * as primitives from './src/primitives-v8-toggle'
import theme from './theme'

addons.setConfig({
  theme,
})

addons.register(ADDON_ID, () => {
  // Register the tool
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Show surrounding links',
    match: ({viewMode}) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: Tool,
  })
})

addons.register(primitives.ADDON_ID, () => {
  // Register the tool
  addons.add(primitives.TOOL_ID, {
    type: types.TOOL,
    title: 'Show surrounding links',
    match: ({viewMode}) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: primitives.Tool,
  })
})
