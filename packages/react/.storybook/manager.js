import {addons, types} from '@storybook/addons'
import {useGlobals} from '@storybook/manager-api'
import {IconButton, WithTooltip, TooltipLinkList} from '@storybook/components'
import {BeakerIcon} from '@primer/octicons-react'
import React from 'react'
import {Tool, TOOL_ID, ADDON_ID} from './src/accessibility-tool'
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

const featureFlagList = ['primer_react_action_list_item_as_button', 'primer_react_css_modules']

addons.register('FEATURE_FLAG_ADDON', () => {
  addons.add('FEATURE_FLAG_ADDON/toolbar', {
    type: types.TOOL,
    match: ({tabId, viewMode}) => {
      return !tabId && viewMode === 'story'
    },
    render: () => {
      const [{featureFlags}, updateGlobals] = useGlobals()
      const hasFeatureEnabled = Object.values(featureFlags ?? {}).find(value => {
        return value
      })
      return (
        <WithTooltip
          placement="top"
          trigger="click"
          closeOnOutsideClick
          tooltip={({onHide}) => {
            return (
              <TooltipLinkList
                links={featureFlagList.map(featureFlag => {
                  const active = featureFlags?.[featureFlag]
                  return {
                    id: featureFlag,
                    title: active ? `✅ ${featureFlag}` : featureFlag,
                    active,
                    onClick: () => {
                      updateGlobals({
                        featureFlags: {
                          ...featureFlags,
                          [featureFlag]: !active,
                        },
                      })
                      onHide()
                    },
                  }
                })}
              />
            )
          }}
        >
          <IconButton active={hasFeatureEnabled} title="Toggle feature flags">
            <BeakerIcon size={14} />
          </IconButton>
        </WithTooltip>
      )
    },
  })
})
