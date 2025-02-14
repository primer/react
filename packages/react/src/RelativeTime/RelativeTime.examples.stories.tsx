import React from 'react'
import RelativeTime from './RelativeTime'
import Link from '../Link'
import {Tooltip} from '../TooltipV2'
import {Button} from '../Button'
import {Stack} from '../Stack'

export default {
  title: 'Components/RelativeTime/Examples',
  component: RelativeTime,
}

export const DynamicRelativeTime = () => {
  const [time, setTime] = React.useState(false)
  return (
    <Stack>
      <div>
        <Button onClick={() => setTime(!time)} aria-describedby="relative-time">
          Show {time ? 'short' : 'exact'} date
        </Button>
      </div>
      <div>
        <RelativeTime
          id="relative-time"
          date={new Date('2020-01-01T00:00:00Z')}
          minute={time ? '2-digit' : undefined}
          hour={time ? 'numeric' : undefined}
          day={time ? '2-digit' : undefined}
          month={time ? 'short' : undefined}
          year={time ? 'numeric' : undefined}
          timeZoneName={time ? 'short' : undefined}
          prefix=""
          noTitle
        />
      </div>
    </Stack>
  )
}

export const LongDate = () => (
  <RelativeTime
    date={new Date('2020-01-01T00:00:00Z')}
    minute="2-digit"
    hour="numeric"
    day="2-digit"
    month="short"
    year="numeric"
    timeZoneName="short"
    prefix=""
    noTitle
  />
)

export const LinkWithTooltip = () => (
  <Tooltip text={new Date('2020-01-01T00:00:00Z').toString()}>
    <Link href="https://www.github.com">
      <RelativeTime date={new Date('2020-01-01T00:00:00Z')} noTitle={true} />
    </Link>
  </Tooltip>
)
