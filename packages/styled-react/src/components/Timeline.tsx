import {
  Timeline as PrimerTimeline,
  type TimelineProps as PrimerTimelineProps,
  type TimelineItemProps as PrimerTimelineItemProps,
  type TimelineBadgeProps as PrimerTimelineBadgeProps,
  type TimelineBodyProps as PrimerTimelineBodyProps,
  type TimelineBreakProps as PrimerTimelineBreakProps,
} from '@primer/react'
import {Box} from './Box'
import {forwardRef} from 'react'
import {type SxProp} from '../sx'

export type TimelineProps = PrimerTimelineProps & SxProp
export type TimelineItemProps = PrimerTimelineItemProps & SxProp
export type TimelineBadgeProps = PrimerTimelineBadgeProps & SxProp
export type TimelineBodyProps = PrimerTimelineBodyProps & SxProp
export type TimelineBreakProps = PrimerTimelineBreakProps & SxProp

const TimelineImpl = forwardRef<HTMLDivElement, TimelineProps>(function Timeline(props, ref) {
  return <Box as={PrimerTimeline} ref={ref} {...props} />
})

const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(function TimelineItem(props, ref) {
  return <Box as={PrimerTimeline.Item} ref={ref} {...props} />
})

function TimelineBadge(props: TimelineBadgeProps) {
  return <Box as={PrimerTimeline.Badge} {...props} />
}

const TimelineBody = forwardRef<HTMLDivElement, TimelineBodyProps>(function TimelineBody(props, ref) {
  return <Box as={PrimerTimeline.Body} ref={ref} {...props} />
})

const TimelineBreak = forwardRef<HTMLDivElement, TimelineBreakProps>(function TimelineBreak(props, ref) {
  return <Box as={PrimerTimeline.Break} ref={ref} {...props} />
})

export const Timeline = Object.assign(TimelineImpl, {
  Item: TimelineItem,
  Badge: TimelineBadge,
  Body: TimelineBody,
  Break: TimelineBreak,
})

// @ts-ignore -- TS doesn't know about the __SLOT__ property
TimelineImpl.__SLOT__ = PrimerTimeline.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
TimelineItem.__SLOT__ = PrimerTimeline.Item.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
TimelineBadge.__SLOT__ = PrimerTimeline.Badge.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
TimelineBody.__SLOT__ = PrimerTimeline.Body.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
TimelineBreak.__SLOT__ = PrimerTimeline.Break.__SLOT__
