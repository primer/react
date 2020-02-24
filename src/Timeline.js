import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'
import Flex from './Flex'
import Box from './Text'
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
  return (
    <TimelineItemInternal {...props} flexDirection="row">
      {props.children}
    </TimelineItemInternal>
  )
}

const TimelineItemInternal = styled(Flex).attrs(props => ({
  className: classnames('Timeline-Item', props.className, props.condensed && 'condensed')
}))`
  position: relative;
  padding: 16px 0;
  margin-left: 16px;
  &::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    display: block;
    width: 2px;
    content: '';
    background-color: #e1e4e8;
  }

  &.condensed {
    padding-top: 4px;
    padding-bottom: 0;
    &:last-child {
      padding-bottom: 16px;
    }

    .TimelineItem-Badge {
      height: 16px;
      margin-top: 8px;
      margin-bottom: 8px;
      color: #959da5;
      background-color: #fff;
      border: 0;
    }
  }
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
  margin-right: 8px;
  margin-left: -15px;
  color: #444d56;
  align-items: center;
  background-color: #e1e4e8;
  border: 2px solid #fff;
  border-radius: 50%;
  justify-content: center;
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
  margin-top: 4px;
  color: #444d56;
  flex: auto;
  font-size: 14px;
`

Timeline.Break = styled(Box)`
  position: relative;
  z-index: 1;
  height: 24px;
  margin: 0;
  margin-bottom: -16px;
  margin-left: 0px;
  background-color: #fff;
  border: 0;
  border-top: 4px solid #e1e4e8;
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
