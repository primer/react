import React from 'react'
import type {Meta} from '@storybook/react'
import type {ComponentProps} from '../utils/types'
import {ActionMenu} from './ActionMenu'
import {ActionList} from '../ActionList'
import {FeatureFlags} from '../FeatureFlags'

export default {
  title: 'Components/ActionMenu/Dev',
  component: ActionMenu,
} as Meta<ComponentProps<typeof ActionMenu>>

export const WithCss = () => (
  <FeatureFlags
    flags={{
      primer_react_css_modules_staff: true,
      primer_react_css_modules_ga: true,
    }}
  >
    <ActionMenu>
      <ActionMenu.Button className="testCustomClassnameColor">Open menu</ActionMenu.Button>
      <ActionMenu.Overlay width="medium" className="testCustomClassnameBorder">
        <ActionList>
          <ActionList.Item onSelect={() => alert('Copy link clicked')}>
            Copy link
            <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Quote reply clicked')}>
            Quote reply
            <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Edit comment clicked')}>
            Edit comment
            <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Divider />
          <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
            Delete file
            <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
          </ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  </FeatureFlags>
)

export const WithSx = () => (
  <FeatureFlags
    flags={{
      primer_react_css_modules_staff: true,
      primer_react_css_modules_ga: true,
    }}
  >
    <ActionMenu>
      <ActionMenu.Button sx={{color: 'success.emphasis'}}>Open menu</ActionMenu.Button>
      <ActionMenu.Overlay width="medium" sx={{border: '1px solid', borderColor: 'success.emphasis'}}>
        <ActionList>
          <ActionList.Item onSelect={() => alert('Copy link clicked')}>
            Copy link
            <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Quote reply clicked')}>
            Quote reply
            <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Edit comment clicked')}>
            Edit comment
            <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Divider />
          <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
            Delete file
            <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
          </ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  </FeatureFlags>
)

export const WithSxAndCSS = () => (
  <FeatureFlags
    flags={{
      primer_react_css_modules_staff: true,
      primer_react_css_modules_ga: true,
    }}
  >
    <ActionMenu>
      <ActionMenu.Button sx={{color: 'success.emphasis'}} className="testCustomClassnameColor">
        Open menu
      </ActionMenu.Button>
      <ActionMenu.Overlay
        width="medium"
        className="testCustomClassnameBorder"
        sx={{border: '1px solid', borderColor: 'success.emphasis'}}
      >
        <ActionList>
          <ActionList.Item onSelect={() => alert('Copy link clicked')}>
            Copy link
            <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Quote reply clicked')}>
            Quote reply
            <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Edit comment clicked')}>
            Edit comment
            <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Divider />
          <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
            Delete file
            <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
          </ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  </FeatureFlags>
)
