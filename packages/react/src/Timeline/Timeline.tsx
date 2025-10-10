import {clsx} from 'clsx'
import React from 'react'
import classes from './Timeline.module.css'

type StyledTimelineProps = {clipSidebar?: boolean; className?: string}

export type TimelineProps = StyledTimelineProps & React.ComponentPropsWithoutRef<'div'>

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(({clipSidebar, className, ...props}, forwardRef) => {
  return (
    <div
      {...props}
      className={clsx(className, classes.Timeline)}
      ref={forwardRef}
      data-clip-sidebar={clipSidebar ? '' : undefined}
    />
  )
})

Timeline.displayName = 'Timeline'

type StyledTimelineItemProps = {condensed?: boolean; className?: string}

/**
 * @deprecated Use the `TimelineItemProps` type instead
 */
export type TimelineItemsProps = StyledTimelineItemProps & React.ComponentPropsWithoutRef<'div'>

export type TimelineItemProps = StyledTimelineItemProps & React.ComponentPropsWithoutRef<'div'>

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({condensed, className, ...props}, forwardRef) => {
    return (
      <div
        {...props}
        className={clsx(className, 'Timeline-Item', classes.TimelineItem)}
        ref={forwardRef}
        data-condensed={condensed ? '' : undefined}
      />
    )
  },
)

TimelineItem.displayName = 'TimelineItem'

export type TimelineBadgeProps = {
  children?: React.ReactNode
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

const TimelineBadge = ({className, ...props}: TimelineBadgeProps) => {
  return (
    <div className={classes.TimelineBadgeWrapper}>
      <div {...props} className={clsx(className, classes.TimelineBadge)} />
    </div>
  )
}

TimelineBadge.displayName = 'Timeline.Badge'

export type TimelineBodyProps = {
  /** Class name for custom styling */
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

const TimelineBody = React.forwardRef<HTMLDivElement, TimelineBodyProps>(({className, ...props}, forwardRef) => {
  return <div {...props} className={clsx(className, classes.TimelineBody)} ref={forwardRef} />
})

TimelineBody.displayName = 'TimelineBody'

export type TimelineBreakProps = {
  /** Class name for custom styling */
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

const TimelineBreak = React.forwardRef<HTMLDivElement, TimelineBreakProps>(({className, ...props}, forwardRef) => {
  return <div {...props} className={clsx(className, classes.TimelineBreak)} ref={forwardRef} />
})

TimelineBreak.displayName = 'TimelineBreak'

export default Object.assign(Timeline, {
  Item: TimelineItem,
  Badge: TimelineBadge,
  Body: TimelineBody,
  Break: TimelineBreak,
})

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Timeline.__SLOT__ = Symbol('Timeline')
// @ts-ignore -- TS doesn't know about the __SLOT__ property
TimelineItem.__SLOT__ = Symbol('Timeline.Item')
// @ts-ignore -- TS doesn't know about the __SLOT__ property
TimelineBadge.__SLOT__ = Symbol('Timeline.Badge')
// @ts-ignore -- TS doesn't know about the __SLOT__ property
TimelineBody.__SLOT__ = Symbol('Timeline.Body')
// @ts-ignore -- TS doesn't know about the __SLOT__ property
TimelineBreak.__SLOT__ = Symbol('Timeline.Break')
