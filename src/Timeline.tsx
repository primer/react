import classnames from 'classnames'
import PropTypes from 'prop-types'
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
    background-color: ${get('colors.gray.2')};
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
        color: ${get('colors.gray.4')};
        background-color: ${get('colors.white')};
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
          border: 2px solid ${get('colors.white')};
        `}
        overflow="hidden"
        color="gray.7"
        bg="gray.2"
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
  color: ${get('colors.gray.7')};
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
  background-color: ${get('colors.white')};
  border: 0;
  border-top: ${get('space.1')} solid ${get('colors.gray.2')};
  ${sx};
`

Timeline.defaultProps = {
  theme
}

Timeline.propTypes = {
  children: PropTypes.node,
  clipSidebar: PropTypes.bool,
  theme: PropTypes.object,
  ...Flex.propTypes,
  ...sx.propTypes
}

TimelineItem.defaultProps = {
  theme
}

TimelineItem.propTypes = {
  children: PropTypes.node,
  condensed: PropTypes.bool,
  theme: PropTypes.object,
  ...Flex.propTypes,
  ...sx.propTypes
}

TimelineItem.displayName = 'Timeline.Item'

TimelineBadge.defaultProps = {
  theme
}

TimelineBadge.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.object,
  ...Flex.propTypes,
  ...sx.propTypes
}

TimelineBadge.displayName = 'Timeline.Badge'

TimelineBody.defaultProps = {
  theme
}

TimelineBody.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.object,
  ...Box.propTypes,
  ...sx.propTypes
}

TimelineBody.displayName = 'Timeline.Body'

TimelineBreak.defaultProps = {
  theme
}

TimelineBreak.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.object,
  ...Box.propTypes,
  ...sx.propTypes
}

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
