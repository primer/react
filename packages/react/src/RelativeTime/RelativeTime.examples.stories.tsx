import React from 'react'
import RelativeTime from './RelativeTime'
import Link from '../Link'
import {Tooltip} from '../TooltipV2'

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
