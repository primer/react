import {InboxIcon, HeartIcon, ChevronDownIcon} from '@primer/octicons-react'
import React from 'react'
import {IconButton} from '.'
import {Tooltip} from '../drafts/Tooltip'
import {ActionMenu, ActionList} from '..'

export default {
  title: 'Components/IconButton/Features',
}

export const Primary = () => <IconButton icon={HeartIcon} variant="primary" aria-label="Favorite" />

export const WithDescription = () => (
  <IconButton icon={InboxIcon} aria-label="Notifications" description="You have no unread notifications." />
)

export const ExternalTooltip = () => (
  <Tooltip text="this is a supportive description for icon button" direction="se">
    <IconButton icon={HeartIcon} aria-label="HeartIcon" />
  </Tooltip>
)

export const AsMenuAnchor = () => (
  <ActionMenu>
    <ActionMenu.Anchor>
      <IconButton icon={ChevronDownIcon} aria-label="Open Menu" />
    </ActionMenu.Anchor>

    <ActionMenu.Overlay width="medium">
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

export const HasExternalTooltip = () => (
  <Tooltip
    text="Notifications"
    direction="e"
    className="custom-class"
    sx={
      {
        /* custom styling */
      }
    }
  >
    <IconButton icon={InboxIcon} aria-label="Notifications" />
  </Tooltip>
)

export const Danger = () => <IconButton icon={HeartIcon} variant="danger" aria-label="Favorite" />

export const Invisible = () => <IconButton icon={HeartIcon} variant="invisible" aria-label="Favorite" />

export const Disabled = () => <IconButton disabled icon={HeartIcon} aria-label="Favorite" />

export const Small = () => <IconButton size="small" icon={HeartIcon} aria-label="Favorite" />

export const Medium = () => <IconButton size="medium" icon={HeartIcon} aria-label="Favorite" />

export const Large = () => <IconButton size="large" icon={HeartIcon} aria-label="Favorite" />
