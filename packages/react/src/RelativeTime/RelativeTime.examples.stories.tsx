import React from 'react'
import RelativeTime from './RelativeTime'
import {ClockIcon} from '@primer/octicons-react'
import Link from '../Link'
import {Tooltip} from '../TooltipV2'
import {IconButton} from '../Button'

export default {
  title: 'Components/RelativeTime/Examples',
  component: RelativeTime,
}

export const NoTitleAttribute = () => <RelativeTime date={new Date('2020-01-01T00:00:00Z')} noTitle={true} />

export const LinkWithTooltip = () => (
  <Tooltip text={new Date('2020-01-01T00:00:00Z').toString()}>
    <Link href="https://www.github.com">
      <RelativeTime date={new Date('2020-01-01T00:00:00Z')} noTitle={true} />
    </Link>
  </Tooltip>
)

// Needs to do something? What can it do...
export const StaticTextWithAdjacentIconButton = () => (
  <div>
    <RelativeTime date={new Date('2020-01-01T00:00:00Z')} sx={{mr: 2}} noTitle={true} />
    <Tooltip text={new Date('2020-01-01T00:00:00Z').toString()}>
      <IconButton icon={ClockIcon} aria-label="Relative time" />
    </Tooltip>
  </div>
)
