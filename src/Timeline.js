import React from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'
// import {COMMON, get} from './constants'
import theme from './theme'
import Flex from './Flex'
import Box from './Text'

const Timeline = props => {
  return (
    <Flex {...props} flexDirection="column">
      {props.children}
    </Flex>
  )
}

Timeline.Item = props => {
  const {...baseProps} = props

  return (
    <TimelineItemInternal {...baseProps} flexDirection="row">
      {props.children}
    </TimelineItemInternal>
  )
}

const TimelineItemInternal = styled(Flex)`
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
`

const TimelineBadgeInternal = styled(Flex)`
  position: relative;
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
`

Timeline.Badge = props => {
  const {size = 32, ...baseProps} = props

  return (
    <TimelineBadgeInternal {...baseProps} height={size} width={size} alignItems="center" justifyContent="center">
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

Timeline.defaultProps = {
  theme
}

// Timeline.propTypes = {
//   children: PropTypes.node,
//   theme: PropTypes.object,
//   ...COMMON.propTypes
// }

Timeline.Item.defaultProps = {
  theme
}

// Timeline.Item.propTypes = {
//   children: PropTypes.node,
//   theme: PropTypes.object,
//   ...COMMON.propTypes
// }

Timeline.Badge.defaultProps = {
  theme
}

// TabNav.Link.propTypes = {
//   as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
//   href: PropTypes.string,
//   selected: PropTypes.bool,
//   ...COMMON.propTypes
// }

export default Timeline
