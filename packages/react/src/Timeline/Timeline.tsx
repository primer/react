import {clsx} from 'clsx'
import React from 'react'
import classes from './Timeline.module.css'

type StyledTimelineProps = {clipSidebar?: boolean | 'start' | 'end' | 'both'; className?: string}

export type TimelineProps = StyledTimelineProps & React.ComponentPropsWithoutRef<'div'>

function resolveClipSidebar(clipSidebar: TimelineProps['clipSidebar']): string | undefined {
  if (clipSidebar === true || clipSidebar === 'both') return 'both'
  if (clipSidebar === 'start' || clipSidebar === 'end') return clipSidebar
  return undefined
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(({clipSidebar, className, ...props}, forwardRef) => {
  const resolvedClipSidebar = resolveClipSidebar(clipSidebar)
  return (
    <div
      {...props}
      className={clsx(className, classes.Timeline)}
      ref={forwardRef}
      data-clip-sidebar={resolvedClipSidebar}
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
