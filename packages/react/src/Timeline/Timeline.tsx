import {clsx} from 'clsx'
import React from 'react'
import Box from '../Box'
import type {SxProp} from '../sx'
import classes from './Timeline.module.css'
import {defaultSxProp} from '../utils/defaultSxProp'

type StyledTimelineProps = {clipSidebar?: boolean; className?: string} & SxProp

export type TimelineProps = StyledTimelineProps & React.ComponentPropsWithoutRef<'div'>

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({clipSidebar, className, sx: sxProp = defaultSxProp, ...props}, forwardRef) => {
    if (sxProp !== defaultSxProp) {
      return (
        <Box
          as="div"
          sx={sxProp}
          {...props}
          className={clsx(className, classes.Timeline)}
          ref={forwardRef}
          data-clip-sidebar={clipSidebar ? '' : undefined}
        />
      )
    }

    return (
      <div
        {...props}
        className={clsx(className, classes.Timeline)}
        ref={forwardRef}
        data-clip-sidebar={clipSidebar ? '' : undefined}
      />
    )
  },
)

Timeline.displayName = 'Timeline'

type StyledTimelineItemProps = {condensed?: boolean; className?: string} & SxProp

/**
 * @deprecated Use the `TimelineItemProps` type instead
 */
export type TimelineItemsProps = StyledTimelineItemProps & SxProp & React.ComponentPropsWithoutRef<'div'>

export type TimelineItemProps = StyledTimelineItemProps & SxProp & React.ComponentPropsWithoutRef<'div'>

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({condensed, className, sx: sxProp = defaultSxProp, ...props}, forwardRef) => {
    if (sxProp !== defaultSxProp) {
      return (
        <Box
          as="div"
          {...props}
          className={clsx(className, 'Timeline-Item', classes.TimelineItem)}
          ref={forwardRef}
          data-condensed={condensed ? '' : undefined}
          sx={sxProp}
        />
      )
    }
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

export type TimelineBadgeProps = {children?: React.ReactNode; className?: string} & SxProp &
  React.ComponentPropsWithoutRef<'div'>

const TimelineBadge = ({sx: sxProp = defaultSxProp, className, ...props}: TimelineBadgeProps) => {
  if (sxProp !== defaultSxProp) {
    return (
      <div className={classes.TimelineBadgeWrapper}>
        <Box {...props} sx={sxProp} className={clsx(className, classes.TimelineBadge)} />
      </div>
    )
  }
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
} & SxProp &
  React.ComponentPropsWithoutRef<'div'>

const TimelineBody = React.forwardRef<HTMLDivElement, TimelineBodyProps>(
  ({className, sx: sxProp = defaultSxProp, ...props}, forwardRef) => {
    if (sxProp !== defaultSxProp) {
      return <Box as="div" {...props} className={clsx(className, classes.TimelineBody)} ref={forwardRef} sx={sxProp} />
    }
    return <div {...props} className={clsx(className, classes.TimelineBody)} ref={forwardRef} />
  },
)

TimelineBody.displayName = 'TimelineBody'

export type TimelineBreakProps = {
  /** Class name for custom styling */
  className?: string
} & SxProp &
  React.ComponentPropsWithoutRef<'div'>

const TimelineBreak = React.forwardRef<HTMLDivElement, TimelineBreakProps>(
  ({className, sx: sxProp = defaultSxProp, ...props}, forwardRef) => {
    if (sxProp !== defaultSxProp) {
      return <Box as="div" {...props} className={clsx(className, classes.TimelineBreak)} ref={forwardRef} sx={sxProp} />
    }
    return <div {...props} className={clsx(className, classes.TimelineBreak)} ref={forwardRef} />
  },
)

TimelineBreak.displayName = 'TimelineBreak'

export default Object.assign(Timeline, {
  Item: TimelineItem,
  Badge: TimelineBadge,
  Body: TimelineBody,
  Break: TimelineBreak,
})
