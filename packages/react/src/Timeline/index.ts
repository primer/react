import {Timeline as TimelineImpl, TimelineItem, TimelineBadge, TimelineBody, TimelineBreak} from './Timeline'
import type {
  TimelineProps,
  TimelineItemsProps,
  TimelineBadgeProps,
  TimelineBodyProps,
  TimelineBreakProps,
} from './Timeline'

export const Timeline = Object.assign(TimelineImpl, {
  Item: TimelineItem,
  Badge: TimelineBadge,
  Body: TimelineBody,
  Break: TimelineBreak,
})

export type {TimelineProps, TimelineItemsProps, TimelineBadgeProps, TimelineBodyProps, TimelineBreakProps}
