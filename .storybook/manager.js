import {addons, types} from '@storybook/addons'
import {ADDON_ID, TOOL_ID, Tool} from './src/accessibility-tool'
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
