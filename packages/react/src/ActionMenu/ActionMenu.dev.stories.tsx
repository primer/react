import React from 'react'
import type {Meta} from '@storybook/react'
import {ActionMenu, ActionList} from '../'
import {sxOverrideTestStyles} from '../utils/story-helpers'

export default {
  title: 'Components/ActionMenu/Dev',
  component: ActionMenu,
} as Meta<typeof ActionMenu>

export const SxPropStressTest = () => (
  <ActionMenu>
    <ActionMenu.Button sx={sxOverrideTestStyles}>Open menu</ActionMenu.Button>
    <ActionMenu.Overlay width="medium" sx={sxOverrideTestStyles}>
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
)
