import React from 'react'
import {cn} from '../../internal/cn'
import {type TimelineBadgeVariant} from './constants'
export interface TimelineProps extends Omit<React.ComponentPropsWithoutRef<'ol'>, 'role'> {
  /** Trims the connecting line at the start, the end, or both, where the timeline meets other content. */
  clipSidebar?: boolean | 'start' | 'end' | 'both'
}
const TimelineRoot = React.forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  {className, clipSidebar, ...rest},
  ref,
) {
  const clip = clipSidebar === true ? 'both' : clipSidebar
  return (
    <ol
      {...rest}
      ref={ref}
      className={cn(
        '@container/timeline m-0 flex list-none flex-col p-0',
        '[&[data-clip-sidebar=start]>li:first-child]:pt-0',
        '[&[data-clip-sidebar=both]>li:first-child]:pt-0',
        '[&[data-clip-sidebar=start]>li:first-child_[data-timeline-avatar]]:top-4',
        '[&[data-clip-sidebar=both]>li:first-child_[data-timeline-avatar]]:top-4',
        '[&[data-clip-sidebar=start]>li:first-child[data-condensed]::before]:top-3',
        '[&[data-clip-sidebar=both]>li:first-child[data-condensed]::before]:top-3',
        '[&[data-clip-sidebar=end]>li:last-child]:pb-0',
        '[&[data-clip-sidebar=both]>li:last-child]:pb-0',
        '[&[data-clip-sidebar=end]>li:last-child[data-condensed]::before]:h-3',
        '[&[data-clip-sidebar=both]>li:last-child[data-condensed]::before]:h-3',
        className,
      )}
      data-component="Timeline"
      data-clip-sidebar={clip || undefined}
    />
  )
})

export interface TimelineItemProps extends React.ComponentPropsWithoutRef<'li'> {
  /** Reduces the item's vertical spacing, for a minor event in the timeline. */
  condensed?: boolean
}
const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(function TimelineItem(
  {className, condensed, ...rest},
  ref,
) {
  return (
    <li
      {...rest}
      ref={ref}
      className={cn(
        'relative ml-4 flex py-4 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-[var(--borderColor-muted)]',
        condensed &&
          'pt-1 pb-0 last:pb-4 [&_[data-timeline-badge]]:my-2 [&_[data-timeline-badge]]:h-4 [&_[data-timeline-badge]]:border-0 [&_[data-timeline-badge]]:bg-default [&_[data-timeline-badge]]:text-muted [&_[data-timeline-avatar]]:top-5',
        "@max-[479px]/timeline:grid @max-[479px]/timeline:grid-cols-[auto_minmax(0,1fr)] @max-[479px]/timeline:[grid-template-areas:'badge_body'_'._actions']",
        className,
      )}
      data-condensed={condensed || undefined}
      data-component="Timeline.Item"
    />
  )
})

export type TimelineAvatarProps = React.ComponentPropsWithoutRef<'div'>
const TimelineAvatar = React.forwardRef<HTMLDivElement, TimelineAvatarProps>(function TimelineAvatar(
  {className, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn('absolute -left-18 top-8 z-1 -translate-y-1/2', className)}
      data-component="Timeline.Avatar"
      data-timeline-avatar=""
    />
  )
})

export interface TimelineBadgeProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Colour of the badge, conveying what kind of event it marks. */
  variant?: TimelineBadgeVariant
}
const badgeColors: Record<TimelineBadgeVariant, string> = {
  accent: 'bg-accent-emphasis',
  success: 'bg-success-emphasis',
  attention: 'bg-attention-emphasis',
  severe: 'bg-severe-emphasis',
  danger: 'bg-danger-emphasis',
  done: 'bg-done-emphasis',
  open: 'bg-open-emphasis',
  closed: 'bg-closed-emphasis',
  sponsors: 'bg-sponsors-emphasis',
}
const TimelineBadge = React.forwardRef<HTMLDivElement, TimelineBadgeProps>(function TimelineBadge(
  {className, variant, ...rest},
  ref,
) {
  return (
    <div className="relative z-1 @max-[479px]/timeline:[grid-area:badge]" data-component="Timeline.BadgeWrapper">
      <div
        {...rest}
        ref={ref}
        className={cn(
          '-ml-[15px] mr-2 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--bgColor-default)] bg-[var(--timelineBadge-bgColor)] text-muted',
          variant && cn(badgeColors[variant], 'text-on-emphasis'),
          className,
        )}
        data-component="Timeline.Badge"
        data-timeline-badge=""
        data-variant={variant}
      />
    </div>
  )
})

export type TimelineBodyProps = React.ComponentPropsWithoutRef<'div'>
const TimelineBody = React.forwardRef<HTMLDivElement, TimelineBodyProps>(function TimelineBody(
  {className, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'mt-[5px] min-w-0 max-w-full flex-auto text-sm text-muted @max-[479px]/timeline:[grid-area:body]',
        className,
      )}
      data-component="Timeline.Body"
    />
  )
})

export type TimelineBreakProps = Omit<React.ComponentPropsWithoutRef<'li'>, 'role'>
const TimelineBreak = React.forwardRef<HTMLLIElement, TimelineBreakProps>(function TimelineBreak(
  {className, ...rest},
  ref,
) {
  return (
    <li
      {...rest}
      ref={ref}
      aria-hidden="true"
      className={cn(
        'relative z-1 -mb-4 h-6 border-t-4 border-default bg-default [&:has(+_[data-condensed])]:-mb-3',
        className,
      )}
      data-component="Timeline.Break"
    />
  )
})

export type TimelineActionsProps = React.ComponentPropsWithoutRef<'div'>
const TimelineActions = React.forwardRef<HTMLDivElement, TimelineActionsProps>(function TimelineActions(
  {className, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'ml-auto flex min-h-8 shrink-0 items-center gap-2 self-start @max-[479px]/timeline:mt-2 @max-[479px]/timeline:ml-0 @max-[479px]/timeline:min-h-0 @max-[479px]/timeline:[grid-area:actions]',
        className,
      )}
      data-component="Timeline.Actions"
    />
  )
})

TimelineRoot.displayName = 'Timeline'
TimelineItem.displayName = 'Timeline.Item'
export const Timeline = Object.assign(TimelineRoot, {
  Item: TimelineItem,
  Avatar: TimelineAvatar,
  Badge: TimelineBadge,
  Body: TimelineBody,
  Break: TimelineBreak,
  Actions: TimelineActions,
})
