import classnames from 'classnames'
import React from 'react'
import styled, {css} from 'styled-components'
import Box, {BoxProps} from './Box'
import {COMMON, get} from './constants'
import sx from './sx'
import {ComponentProps} from './utils/types'

const Timeline = styled(Box)<{clipSidebar?: boolean}>`
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
`

type StyledTimelineItemProps = {condensed?: boolean}

const TimelineItem = styled(Box).attrs<StyledTimelineItemProps>(props => ({
  className: classnames('Timeline-Item', props.className)
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
    background-color: ${get('colors.border.secondary')};
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
        color: ${get('colors.icon.tertiary')};
        background-color: ${get('colors.bg.canvas')};
        border: 0;
      }
    `}

  ${COMMON};
  ${sx};
`

export type TimelineBadgeProps = BoxProps

const TimelineBadge = (props: TimelineBadgeProps) => {
  return (
    <Box position="relative" zIndex={1}>
      <Box
        display="flex"
        className={classnames(props.className, 'TimelineItem-Badge')}
        flexShrink={0}
        borderRadius="50%"
        borderWidth="2px"
        borderStyle="solid"
        borderColor="bg.canvas"
        overflow="hidden"
        color="icon.secondary"
        bg="timeline.badgeBg"
        width="32px"
        height="32px"
        mr={2}
        ml="-15px"
        alignItems="center"
        justifyContent="center"
        {...props}
      >
        {props.children}
      </Box>
    </Box>
  )
}

const TimelineBody = styled(Box)`
  min-width: 0;
  max-width: 100%;
  margin-top: ${get('space.1')};
  color: ${get('colors.timeline.text')};
  flex: auto;
  font-size: ${get('fontSizes.1')};
  ${sx};
`

const TimelineBreak = styled(Box)`
  position: relative
  z-index: 1;
  height: 24px;
  margin: 0;
  margin-bottom: -${get('space.3')};
  margin-left: 0;
  background-color: ${get('colors.bg.canvas')};
  border: 0;
  border-top: ${get('space.1')} solid ${get('colors.border.primary')};
  ${sx};
`

TimelineItem.displayName = 'Timeline.Item'

TimelineBadge.displayName = 'Timeline.Badge'

TimelineBody.displayName = 'Timeline.Body'

TimelineBreak.displayName = 'Timeline.Break'

export type TimelineProps = ComponentProps<typeof Timeline>
export type TimelineItemsProps = ComponentProps<typeof TimelineItem>
export type TimelineBodyProps = ComponentProps<typeof TimelineBody>
export type TimelineBreakProps = ComponentProps<typeof TimelineBreak>
export default Object.assign(Timeline, {
  Item: TimelineItem,
  Badge: TimelineBadge,
  Body: TimelineBody,
  Break: TimelineBreak
})
