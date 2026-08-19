import {clsx} from 'clsx'
import React from 'react'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './Timeline.module.css'
import type {TimelineBadgeVariants} from './constants'
import {mergeProps} from '../utils/mergeProps'

type StyledTimelineProps = {clipSidebar?: boolean | 'start' | 'end' | 'both'; className?: string}

export type TimelineProps = StyledTimelineProps & Omit<React.ComponentPropsWithoutRef<'ol'>, 'role'>

function resolveClipSidebar(clipSidebar: TimelineProps['clipSidebar']): string | undefined {
  if (clipSidebar === true || clipSidebar === 'both') return 'both'
  if (clipSidebar === 'start' || clipSidebar === 'end') return clipSidebar
  return undefined
}

const Timeline = React.forwardRef<HTMLDivElement | HTMLOListElement, TimelineProps>(
  ({clipSidebar, className, ...props}, forwardRef) => {
    const useListSemantics = useFeatureFlag('primer_react_timeline_list_semantics')
    const resolvedClipSidebar = resolveClipSidebar(clipSidebar)

    if (useListSemantics) {
      return (
        // Explicit role restores list semantics in Safari/VoiceOver, which strips
        // them when list-style: none is applied (WebKit intentional behaviour).
        // eslint-disable-next-line jsx-a11y/no-redundant-roles
        <ol
          ref={forwardRef as React.ForwardedRef<HTMLOListElement>}
          {...mergeProps({className: clsx(className, classes.Timeline)}, props)}
          role="list"
          data-clip-sidebar={resolvedClipSidebar}
        />
      )
    }

    return (
      <div
        ref={forwardRef as React.ForwardedRef<HTMLDivElement>}
        {...mergeProps({className: clsx(className, classes.Timeline)}, props as React.ComponentPropsWithoutRef<'div'>)}
        data-clip-sidebar={resolvedClipSidebar}
      />
    )
  },
)

Timeline.displayName = 'Timeline'

type StyledTimelineItemProps = {condensed?: boolean; className?: string}

/**
 * @deprecated Use the `TimelineItemProps` type instead
 */
export type TimelineItemsProps = StyledTimelineItemProps & React.ComponentPropsWithoutRef<'li'>

export type TimelineItemProps = StyledTimelineItemProps & React.ComponentPropsWithoutRef<'li'>

const TimelineItem = React.forwardRef<HTMLDivElement | HTMLLIElement, TimelineItemProps>(
  ({condensed, className, ...props}, forwardRef) => {
    const useListSemantics = useFeatureFlag('primer_react_timeline_list_semantics')

    if (useListSemantics) {
      return (
        <li
          ref={forwardRef as React.ForwardedRef<HTMLLIElement>}
          {...mergeProps({className: clsx(className, 'Timeline-Item', classes.TimelineItem)}, props)}
          data-condensed={condensed ? '' : undefined}
        />
      )
    }

    return (
      <div
        ref={forwardRef as React.ForwardedRef<HTMLDivElement>}
        {...mergeProps(
          {className: clsx(className, 'Timeline-Item', classes.TimelineItem)},
          props as React.ComponentPropsWithoutRef<'div'>,
        )}
        data-condensed={condensed ? '' : undefined}
      />
    )
  },
)

TimelineItem.displayName = 'TimelineItem'

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
      <div {...mergeProps({className: clsx(className, classes.TimelineBadge)}, props)} data-variant={variant} />
    </div>
  )
}

TimelineBadge.displayName = 'Timeline.Badge'

export type TimelineBodyProps = {
  /** Class name for custom styling */
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

const TimelineBody = React.forwardRef<HTMLDivElement, TimelineBodyProps>(({className, ...props}, forwardRef) => {
  return <div ref={forwardRef} {...mergeProps({className: clsx(className, classes.TimelineBody)}, props)} />
})

TimelineBody.displayName = 'TimelineBody'

export type TimelineBreakProps = {
  /** Class name for custom styling */
  className?: string
} & Omit<React.ComponentPropsWithoutRef<'li'>, 'role'>

const TimelineBreak = React.forwardRef<HTMLDivElement | HTMLLIElement, TimelineBreakProps>(
  ({className, ...props}, forwardRef) => {
    const useListSemantics = useFeatureFlag('primer_react_timeline_list_semantics')

    if (useListSemantics) {
      return (
        <li
          ref={forwardRef as React.ForwardedRef<HTMLLIElement>}
          {...mergeProps({className: clsx(className, classes.TimelineBreak)}, props)}
          role="presentation"
        />
      )
    }

    return (
      <div
        ref={forwardRef as React.ForwardedRef<HTMLDivElement>}
        {...mergeProps(
          {className: clsx(className, classes.TimelineBreak)},
          props as React.ComponentPropsWithoutRef<'div'>,
        )}
      />
    )
  },
)

TimelineBreak.displayName = 'TimelineBreak'

export type TimelineActionsProps = {
  /** Class name for custom styling */
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

const TimelineActions = React.forwardRef<HTMLDivElement, TimelineActionsProps>(({className, ...props}, forwardRef) => {
  return <div ref={forwardRef} {...mergeProps({className: clsx(className, classes.TimelineItemActions)}, props)} />
})

TimelineActions.displayName = 'Timeline.Actions'

export type TimelineAvatarProps = {
  /** Class name for custom styling */
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

const TimelineAvatar = React.forwardRef<HTMLDivElement, TimelineAvatarProps>(({className, ...props}, forwardRef) => {
  return <div ref={forwardRef} {...mergeProps({className: clsx(className, classes.TimelineItemAvatar)}, props)} />
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
