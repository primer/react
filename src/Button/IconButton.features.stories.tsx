import {InboxIcon, HeartIcon} from '@primer/octicons-react'
import React from 'react'
import {IconButton} from '.'
import {Tooltip} from '../drafts/Tooltip'

export default {
  title: 'Components/IconButton/Features',
}

export const Primary = () => <IconButton icon={HeartIcon} variant="primary" label="Primary" />

export const WithDescription = () => (
  <IconButton icon={InboxIcon} label="Notifications" description="You have no unread notifications." />
)

export const ExternalTooltip = () => (
  <Tooltip text="this is a supportive description for icon button" direction="se">
    <IconButton icon={HeartIcon} label="HeartIcon" />
  </Tooltip>
)

export const Danger = () => <IconButton icon={HeartIcon} variant="danger" aria-label="Danger" />

export const Invisible = () => <IconButton icon={HeartIcon} variant="invisible" aria-label="Invisible" />

export const Disabled = () => <IconButton disabled icon={HeartIcon} aria-label="Disabled" />

export const Small = () => <IconButton size="small" icon={HeartIcon} aria-label="Default" />

export const Medium = () => <IconButton size="medium" icon={HeartIcon} aria-label="Default" />

export const Large = () => <IconButton size="large" icon={HeartIcon} aria-label="Default" />
