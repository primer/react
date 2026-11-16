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
        'primer:@container/timeline primer:m-0 primer:flex primer:list-none primer:flex-col primer:p-0',
        'primer:[&[data-clip-sidebar=start]>li:first-child]:pt-0',
        'primer:[&[data-clip-sidebar=both]>li:first-child]:pt-0',
        'primer:[&[data-clip-sidebar=start]>li:first-child_[data-timeline-avatar]]:top-4',
        'primer:[&[data-clip-sidebar=both]>li:first-child_[data-timeline-avatar]]:top-4',
        'primer:[&[data-clip-sidebar=start]>li:first-child[data-condensed]::before]:top-3',
        'primer:[&[data-clip-sidebar=both]>li:first-child[data-condensed]::before]:top-3',
        'primer:[&[data-clip-sidebar=end]>li:last-child]:pb-0',
        'primer:[&[data-clip-sidebar=both]>li:last-child]:pb-0',
        'primer:[&[data-clip-sidebar=end]>li:last-child[data-condensed]::before]:h-3',
        'primer:[&[data-clip-sidebar=both]>li:last-child[data-condensed]::before]:h-3',
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
        'primer:relative primer:ml-4 primer:flex primer:py-4 primer:before:absolute primer:before:inset-y-0 primer:before:left-0 primer:before:w-0.5 primer:before:bg-[var(--borderColor-muted)]',
        condensed &&
          'primer:pt-1 primer:pb-0 primer:last:pb-4 primer:[&_[data-timeline-badge]]:my-2 primer:[&_[data-timeline-badge]]:h-4 primer:[&_[data-timeline-badge]]:border-0 primer:[&_[data-timeline-badge]]:bg-default primer:[&_[data-timeline-badge]]:text-muted primer:[&_[data-timeline-avatar]]:top-5',
        "primer:@max-[479px]/timeline:grid primer:@max-[479px]/timeline:grid-cols-[auto_minmax(0,1fr)] primer:@max-[479px]/timeline:[grid-template-areas:'badge_body'_'._actions']",
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
      className={cn('primer:absolute primer:-left-18 primer:top-8 primer:z-1 primer:-translate-y-1/2', className)}
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
  accent: 'primer:bg-accent-emphasis',
  success: 'primer:bg-success-emphasis',
  attention: 'primer:bg-attention-emphasis',
  severe: 'primer:bg-severe-emphasis',
  danger: 'primer:bg-danger-emphasis',
  done: 'primer:bg-done-emphasis',
  open: 'primer:bg-open-emphasis',
  closed: 'primer:bg-closed-emphasis',
  sponsors: 'primer:bg-sponsors-emphasis',
}
const TimelineBadge = React.forwardRef<HTMLDivElement, TimelineBadgeProps>(function TimelineBadge(
  {className, variant, ...rest},
  ref,
) {
  return (
    <div
      className="primer:relative primer:z-1 primer:@max-[479px]/timeline:[grid-area:badge]"
      data-component="Timeline.BadgeWrapper"
    >
      <div
        {...rest}
        ref={ref}
        className={cn(
          'primer:-ml-[15px] primer:mr-2 primer:flex primer:size-8 primer:shrink-0 primer:items-center primer:justify-center primer:overflow-hidden primer:rounded-full primer:border-2 primer:border-[var(--bgColor-default)] primer:bg-[var(--timelineBadge-bgColor)] primer:text-muted',
          variant && cn(badgeColors[variant], 'primer:text-on-emphasis'),
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
        'primer:mt-[5px] primer:min-w-0 primer:max-w-full primer:flex-auto primer:text-sm primer:text-muted primer:@max-[479px]/timeline:[grid-area:body]',
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
        'primer:relative primer:z-1 primer:-mb-4 primer:h-6 primer:border-t-4 primer:border-default primer:bg-default primer:[&:has(+_[data-condensed])]:-mb-3',
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
        'primer:ml-auto primer:flex primer:min-h-8 primer:shrink-0 primer:items-center primer:gap-2 primer:self-start primer:@max-[479px]/timeline:mt-2 primer:@max-[479px]/timeline:ml-0 primer:@max-[479px]/timeline:min-h-0 primer:@max-[479px]/timeline:[grid-area:actions]',
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
