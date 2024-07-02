import React, {useState} from 'react'
import {HeartIcon, InboxIcon, ChevronDownIcon, DownloadIcon} from '@primer/octicons-react'
import {IconButton} from '.'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import {Tooltip} from '../TooltipV2'
import {default as TooltipV1} from '../Tooltip'

export default {
  title: 'Components/IconButton/Features',
}

export const Primary = () => (
  <IconButton icon={HeartIcon} variant="primary" aria-label="Favorite" unsafeDisableTooltip={false} />
)

export const Danger = () => (
  <IconButton icon={HeartIcon} variant="danger" aria-label="Favorite" unsafeDisableTooltip={false} />
)

export const Invisible = () => (
  <IconButton icon={HeartIcon} variant="invisible" aria-label="Favorite" unsafeDisableTooltip={false} />
)

export const Disabled = () => (
  <IconButton disabled icon={HeartIcon} aria-label="Favorite" unsafeDisableTooltip={false} />
)

export const Small = () => (
  <IconButton size="small" icon={HeartIcon} aria-label="Favorite" unsafeDisableTooltip={false} />
)

export const Medium = () => (
  <IconButton size="medium" icon={HeartIcon} aria-label="Favorite" unsafeDisableTooltip={false} />
)

export const Large = () => (
  <IconButton size="large" icon={HeartIcon} aria-label="Favorite" unsafeDisableTooltip={false} />
)

export const WithDescription = () => (
  <IconButton
    icon={InboxIcon}
    aria-label="Notifications"
    description="You have no unread notifications."
    unsafeDisableTooltip={false}
  />
)

export const ExternalTooltip = () => (
  <Tooltip text="this is a supportive description for icon button" direction="se">
    <IconButton icon={HeartIcon} aria-label="HeartIcon" />
  </Tooltip>
)

export const ExternalTooltipVersion1 = () => (
  <TooltipV1 text="this is a supportive description for icon button" direction="se">
    <IconButton icon={HeartIcon} aria-label="HeartIcon" />
  </TooltipV1>
)

export const AsAMenuAnchor = () => (
  <ActionMenu>
    <ActionMenu.Anchor>
      <IconButton icon={ChevronDownIcon} aria-label="Something" unsafeDisableTooltip={false} />
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

export const Loading = () => <IconButton loading icon={HeartIcon} variant="primary" aria-label="Primary" />

export const LoadingTrigger = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return <IconButton loading={isLoading} onClick={handleClick} icon={DownloadIcon} aria-label="Download" />
}
