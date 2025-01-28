import {clsx} from 'clsx'
import React, {type HTMLProps} from 'react'
import styled, {css} from 'styled-components'
import Box from '../Box'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './Timeline.module.css'
import {defaultSxProp} from '../utils/defaultSxProp'

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'

type StyledTimelineProps = {clipSidebar?: boolean; className?: string} & SxProp

const ToggleTimeline = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'div',
  styled.div<StyledTimelineProps>`
    display: flex;
    flex-direction: column;
    ${props =>
      props.clipSidebar &&
      css`
        .Timeline-Item:first-child {
          padding-top: 0;
        }

        .Timeline-Item:last-child {
          padding-bottom: 0;
        }
      `}

    ${sx};
  `,
)

export type TimelineProps = StyledTimelineProps & HTMLProps<HTMLDivElement>

const Timeline = React.forwardRef<HTMLElement, TimelineProps>(function Timeline(
  {clipSidebar, className, ...props},
  forwardRef,
) {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  if (enabled) {
    return (
      <ToggleTimeline
        {...props}
        className={clsx(className, classes.Timeline)}
        ref={forwardRef}
        data-clip-sidebar={clipSidebar ? '' : undefined}
      />
    )
  }

  return <ToggleTimeline {...props} className={className} ref={forwardRef} clipSidebar={clipSidebar} />
})

Timeline.displayName = 'Timeline'

type StyledTimelineItemProps = {condensed?: boolean; className?: string} & SxProp

const ToggleTimelineItem = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'div',
  styled.div.attrs<StyledTimelineItemProps>(props => ({
    className: clsx('Timeline-Item', props.className),
  }))<StyledTimelineItemProps>`
    display: flex;
    position: relative;
    padding: ${get('space.3')} 0;
    margin-left: ${get('space.3')};

    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      display: block;
      width: 2px;
      content: '';
      background-color: ${get('colors.border.muted')};
    }

    ${props =>
      props.condensed &&
      css`
        padding-top: ${get('space.1')};
        padding-bottom: 0;
        &:last-child {
          padding-bottom: ${get('space.3')};
        }

        .TimelineItem-Badge {
          height: 16px;
          margin-top: ${get('space.2')};
          margin-bottom: ${get('space.2')};
          color: ${get('colors.fg.muted')};
          background-color: ${get('colors.canvas.default')};
          border: 0;
        }
      `}

    ${sx};
  `,
)

/**
 * @deprecated Use the `TimelineItemProps` type instead
 */
export type TimelineItemsProps = StyledTimelineItemProps & HTMLProps<HTMLDivElement>

export type TimelineItemProps = StyledTimelineItemProps & HTMLProps<HTMLDivElement>

const TimelineItem = React.forwardRef<HTMLElement, TimelineItemProps>(function TimelineItem(
  {condensed, className, ...props},
  forwardRef,
) {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  if (enabled) {
    return (
      <ToggleTimelineItem
        {...props}
        className={clsx(className, classes.TimelineItem)}
        ref={forwardRef}
        data-condensed={condensed ? '' : undefined}
      />
    )
  }

  return <ToggleTimelineItem {...props} className={className} ref={forwardRef} condensed={condensed} />
})

TimelineItem.displayName = 'TimelineItem'

export type TimelineBadgeProps = {children?: React.ReactNode; className?: string} & SxProp &
  React.ComponentPropsWithoutRef<'div'>

const TimelineBadge = ({sx, className, ...props}: TimelineBadgeProps) => {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  if (enabled) {
    if (sx !== defaultSxProp) {
      return (
        <div className={classes.TimelineBadgeWrapper}>
          <Box {...props} sx={sx} className={clsx(className, classes.TimelineBadge)} />
        </div>
      )
    }
    return (
      <div className={classes.TimelineBadgeWrapper}>
        <div {...props} className={clsx(className, classes.TimelineBadge)} />
      </div>
    )
  }
  return (
    <Box position="relative" zIndex={1}>
      <Box
        display="flex"
        className="TimelineItem-Badge"
        flexShrink={0}
        borderRadius="50%"
        borderWidth="2px"
        borderStyle="solid"
        borderColor="canvas.default"
        overflow="hidden"
        color="fg.muted"
        bg="timeline.badgeBg"
        width="32px"
        height="32px"
        mr={2}
        ml="-15px"
        alignItems="center"
        justifyContent="center"
        sx={sx}
      >
        {props.children}
      </Box>
    </Box>
  )
}

TimelineBadge.displayName = 'Timeline.Badge'

const ToggleTimelineBody = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'div',
  styled.div<SxProp>`
    min-width: 0;
    max-width: 100%;
    margin-top: ${get('space.1')};
    color: ${get('colors.fg.muted')};
    flex: auto;
    font-size: ${get('fontSizes.1')};
    ${sx};
  `,
)

export type TimelineBodyProps = {
  /** Class name for custom styling */
  className?: string
} & SxProp &
  HTMLProps<HTMLDivElement>

const TimelineBody = React.forwardRef<HTMLElement, TimelineBodyProps>(function TimelineBody(
  {className, ...props},
  forwardRef,
) {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  if (enabled) {
    return <ToggleTimelineBody {...props} className={clsx(className, classes.TimelineBody)} ref={forwardRef} />
  }

  return <ToggleTimelineBody {...props} className={className} ref={forwardRef} />
})

TimelineBody.displayName = 'TimelineBody'

const ToggleTimelineBreak = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'div',
  styled.div<SxProp>`
    position: relative;
    z-index: 1;
    height: 24px;
    margin: 0;
    margin-bottom: -${get('space.3')};
    margin-left: 0;
    background-color: ${get('colors.canvas.default')};
    border: 0;
    border-top: ${get('space.1')} solid ${get('colors.border.default')};
    ${sx};
  `,
)

export type TimelineBreakProps = {
  /** Class name for custom styling */
  className?: string
} & SxProp &
  HTMLProps<HTMLDivElement>

const TimelineBreak = React.forwardRef<HTMLElement, TimelineBreakProps>(function TimelineBreak(
  {className, ...props},
  forwardRef,
) {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  if (enabled) {
    return <ToggleTimelineBreak {...props} className={clsx(className, classes.TimelineBreak)} ref={forwardRef} />
  }

  return <ToggleTimelineBreak {...props} className={className} ref={forwardRef} />
})

TimelineBreak.displayName = 'TimelineBreak'

export default Object.assign(Timeline, {
  Item: TimelineItem,
  Badge: TimelineBadge,
  Body: TimelineBody,
  Break: TimelineBreak,
})
