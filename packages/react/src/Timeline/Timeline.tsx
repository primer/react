import {clsx} from 'clsx'
import React from 'react'
import classes from './Timeline.module.css'

type StyledTimelineProps = {clipSidebar?: boolean | 'start' | 'end' | 'both'; className?: string}

export type TimelineProps = StyledTimelineProps & React.ComponentPropsWithoutRef<'ol'>

function resolveClipSidebar(clipSidebar: TimelineProps['clipSidebar']): string | undefined {
  if (clipSidebar === true || clipSidebar === 'both') return 'both'
  if (clipSidebar === 'start' || clipSidebar === 'end') return clipSidebar
  return undefined
}

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(({clipSidebar, className, ...props}, forwardRef) => {
  const resolvedClipSidebar = resolveClipSidebar(clipSidebar)
  return (
    <ol
      // Explicit role restores list semantics in Safari/VoiceOver, which strips
      // them when list-style: none is applied (WebKit intentional behaviour).
      role="list"
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
export type TimelineItemsProps = StyledTimelineItemProps & React.ComponentPropsWithoutRef<'li'>

export type TimelineItemProps = StyledTimelineItemProps & React.ComponentPropsWithoutRef<'li'>

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({condensed, className, ...props}, forwardRef) => {
    return (
      <li
        {...props}
        className={clsx(className, 'Timeline-Item', classes.TimelineItem)}
        ref={forwardRef}
        data-condensed={condensed ? '' : undefined}
      />
    )
  },
)

TimelineItem.displayName = 'TimelineItem'

export const TimelineBadgeVariants = [
  'accent',
  'success',
  'attention',
  'severe',
  'danger',
  'done',
  'open',
  'closed',
  'sponsors',
] as const

export type TimelineBadgeVariant = (typeof TimelineBadgeVariants)[number]

export type TimelineBadgeProps = {
  children?: React.ReactNode
  className?: string
  /** The color variant of the badge */
  variant?: TimelineBadgeVariant
} & React.ComponentPropsWithoutRef<'div'>

const TimelineBadge = ({className, variant, ...props}: TimelineBadgeProps) => {
  return (
    <div className={classes.TimelineBadgeWrapper}>
      <div {...props} className={clsx(className, classes.TimelineBadge)} data-variant={variant} />
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
} & Omit<React.ComponentPropsWithoutRef<'li'>, 'role'>

const TimelineBreak = React.forwardRef<HTMLLIElement, TimelineBreakProps>(({className, ...props}, forwardRef) => {
  return <li {...props} className={clsx(className, classes.TimelineBreak)} ref={forwardRef} role="presentation" />
})

TimelineBreak.displayName = 'TimelineBreak'

export type TimelineActionsProps = {
  /** Class name for custom styling */
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

const TimelineActions = React.forwardRef<HTMLDivElement, TimelineActionsProps>(({className, ...props}, forwardRef) => {
  return <div {...props} className={clsx(className, classes.TimelineItemActions)} ref={forwardRef} />
})

TimelineActions.displayName = 'Timeline.Actions'

export type TimelineAvatarProps = {
  /** Class name for custom styling */
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

const TimelineAvatar = React.forwardRef<HTMLDivElement, TimelineAvatarProps>(({className, ...props}, forwardRef) => {
  return <div {...props} className={clsx(className, classes.TimelineItemAvatar)} ref={forwardRef} />
})

TimelineAvatar.displayName = 'Timeline.Avatar'

export default Object.assign(Timeline, {
  Item: TimelineItem,
  Avatar: TimelineAvatar,
  Badge: TimelineBadge,
  Body: TimelineBody,
  Break: TimelineBreak,
  Actions: TimelineActions,
})
