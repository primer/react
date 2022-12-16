import {addons, types} from '@storybook/addons'
import {Tool, TOOL_ID, ADDON_ID} from './src/accessibility-tool'
import theme from './theme'

addons.setConfig({
  theme,
  // Some stories may set up keyboard event handlers, which can be interfered
  // with by these keyboard shortcuts.
  enableShortcuts: false,
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
