import {clsx} from 'clsx'
import React from 'react'
import type {SxProp} from '../sx'
import classes from './Timeline.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

type StyledTimelineProps = {clipSidebar?: boolean; className?: string} & SxProp

export type TimelineProps = StyledTimelineProps & React.ComponentPropsWithoutRef<'div'>

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(({clipSidebar, className, ...props}, forwardRef) => {
  return (
    <BoxWithFallback
      {...props}
      className={clsx(className, classes.Timeline)}
      ref={forwardRef}
      data-clip-sidebar={clipSidebar ? '' : undefined}
    />
  )
})

Timeline.displayName = 'Timeline'

type StyledTimelineItemProps = {condensed?: boolean; className?: string} & SxProp

/**
 * @deprecated Use the `TimelineItemProps` type instead
 */
export type TimelineItemsProps = StyledTimelineItemProps & SxProp & React.ComponentPropsWithoutRef<'div'>

export type TimelineItemProps = StyledTimelineItemProps & SxProp & React.ComponentPropsWithoutRef<'div'>

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({condensed, className, ...props}, forwardRef) => {
    return (
      <BoxWithFallback
        {...props}
        className={clsx(className, 'Timeline-Item', classes.TimelineItem)}
        ref={forwardRef}
        data-condensed={condensed ? '' : undefined}
      />
    )
  },
)

TimelineItem.displayName = 'TimelineItem'

export type TimelineBadgeProps = {children?: React.ReactNode; className?: string} & SxProp &
  React.ComponentPropsWithoutRef<'div'>

const TimelineBadge = ({className, ...props}: TimelineBadgeProps) => {
  return (
    <div className={classes.TimelineBadgeWrapper}>
      <BoxWithFallback {...props} className={clsx(className, classes.TimelineBadge)} />
    </div>
  )
}

TimelineBadge.displayName = 'Timeline.Badge'

export type TimelineBodyProps = {
  /** Class name for custom styling */
  className?: string
} & SxProp &
  React.ComponentPropsWithoutRef<'div'>

const TimelineBody = React.forwardRef<HTMLDivElement, TimelineBodyProps>(({className, ...props}, forwardRef) => {
  return <BoxWithFallback {...props} className={clsx(className, classes.TimelineBody)} ref={forwardRef} />
})

TimelineBody.displayName = 'TimelineBody'

export type TimelineBreakProps = {
  /** Class name for custom styling */
  className?: string
} & SxProp &
  React.ComponentPropsWithoutRef<'div'>

const TimelineBreak = React.forwardRef<HTMLDivElement, TimelineBreakProps>(({className, ...props}, forwardRef) => {
  return <BoxWithFallback {...props} className={clsx(className, classes.TimelineBreak)} ref={forwardRef} />
})

TimelineBreak.displayName = 'TimelineBreak'

export default Object.assign(Timeline, {
  Item: TimelineItem,
  Badge: TimelineBadge,
  Body: TimelineBody,
  Break: TimelineBreak,
})
