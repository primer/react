import {addons, types, useGlobals} from 'storybook/manager-api'
import {IconButton, WithTooltip, TooltipLinkList} from 'storybook/internal/components'
import {BeakerIcon} from '@primer/octicons-react'
import React from 'react'
import {Tool, TOOL_ID, ADDON_ID} from './src/accessibility-tool'
import theme from './theme'
import {DefaultFeatureFlags} from '../src/FeatureFlags/DefaultFeatureFlags'

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

const featureFlagList = Array.from(DefaultFeatureFlags.flags.keys())

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
