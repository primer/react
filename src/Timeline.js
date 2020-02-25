import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'
import Box from './Box'
import Flex from './Flex'
import {Relative} from './Position'
import classnames from 'classnames'

const Timeline = styled(Flex)`
  flex-direction: column;
  ${props =>
    props.clipSidebar &&
    `.Timeline-Item:first-child {
    padding-top: 0;
  }

  .Timeline-Item:last-child {
    padding-bottom: 0;
  }
`}
`

Timeline.Item = props => {
  return <TimelineItemInternal {...props}>{props.children}</TimelineItemInternal>
}

const TimelineItemInternal = styled(Flex).attrs(props => ({
  className: classnames('Timeline-Item', props.className)
}))`
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
    `
    padding-top: ${props.theme.space['1']};
    padding-bottom: 0;
    &:last-child {
      padding-bottom: ${props.theme.space['3']};
    }

    .TimelineItem-Badge {
      height: 16px;
      margin-top: ${props.theme.space['2']};
      margin-bottom: ${props.theme.space['2']};
      color: ${props.theme.colors.gray[4]};
      background-color: ${props.theme.colors.white};
      border: 0;
    }
  `}
  ${COMMON};
`

const TimelineBadgeInternal = styled(Flex).attrs(props => ({
  className: classnames(props.className, 'TimelineItem-Badge')
}))`
  position: relative;
  overflow: hidden;
  z-index: 1;
  width: 32px;
  height: 32px;
  margin-right: ${get('space.2')};
  margin-left: -15px;
  color: ${get('colors.gray.7')};
  background-color: ${get('colors.gray.2')};
  border: 2px solid ${get('colors.white')};
  border-radius: 50%;
  flex-shrink: 0;
  ${COMMON};
`

Timeline.Badge = props => {
  return (
    <TimelineBadgeInternal {...props} alignItems="center" justifyContent="center">
      {props.children}
    </TimelineBadgeInternal>
  )
}

Timeline.Body = styled(Box)`
  min-width: 0;
  max-width: 100%;
  margin-top: ${get('space.1')};
  color: ${get('colors.gray.7')};
  flex: auto;
  font-size: ${get('fontSizes.1')};
`

Timeline.Break = styled(Relative)`
  z-index: 1;
  height: 24px;
  margin: 0;
  margin-bottom: -${get('space.3')};
  margin-left: 0;
  background-color: ${get('colors.white')};
  border: 0;
  border-top: ${get('space.1')} solid ${get('colors.gray.2')};
`

Timeline.defaultProps = {
  theme
}

Timeline.propTypes = {
  children: PropTypes.node,
  clipSidebar: PropTypes.bool,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

Timeline.Item.defaultProps = {
  theme
}

Timeline.Item.propTypes = {
  children: PropTypes.node,
  condensed: PropTypes.bool,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

Timeline.Badge.defaultProps = {
  theme
}

Timeline.Badge.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

Timeline.Break.defaultProps = {
  theme
}

Timeline.Break.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

export default Timeline
