import classnames from 'classnames'
import React from 'react'
import styled, {css} from 'styled-components'
import Box from './Box'
import {COMMON, get} from './constants'
import Flex, {FlexProps} from './Flex'
import {Relative} from './Position'
import sx from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

const Timeline = styled(Flex)<{clipSidebar?: boolean}>`
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

const TimelineItem = styled(Flex).attrs<StyledTimelineItemProps>(props => ({
  className: classnames('Timeline-Item', props.className)
}))<StyledTimelineItemProps>`
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

export type TimelineBadgeProps = FlexProps

const TimelineBadge = (props: TimelineBadgeProps) => {
  return (
    <Relative zIndex={1}>
      <Flex
        className={classnames(props.className, 'TimelineItem-Badge')}
        flexShrink={0}
        css={`
          border-radius: 50%;
          border: 2px solid ${get('colors.bg.canvas')};
        `}
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
      </Flex>
    </Relative>
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

const TimelineBreak = styled(Relative)`
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

Timeline.defaultProps = {theme}

TimelineItem.defaultProps = {theme}
TimelineItem.displayName = 'Timeline.Item'

TimelineBadge.defaultProps = {theme}
TimelineBadge.displayName = 'Timeline.Badge'

TimelineBody.defaultProps = {theme}
TimelineBody.displayName = 'Timeline.Body'

TimelineBreak.defaultProps = {theme}
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
