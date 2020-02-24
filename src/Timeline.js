import React from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'
// import {COMMON, get} from './constants'
import theme from './theme'
import BorderBox from './BorderBox'
import Flex from './Flex'

const Timeline = props => {
  return (
    <Flex {...props} flexDirection="column">
      {props.children}
    </Flex>
  )
}

Timeline.Item = props => {
  const {hideSidebar = false, badgeColor = 'gray.1', badgeContent, ...baseProps} = props

  return (
    <Flex {...baseProps} flexDirection="row">
      <Flex flexShrink={0} width="32px" style={{position: 'relative'}}>
        {!hideSidebar && (
          <BorderBox border="1px solid black" height="100%" style={{position: 'absolute', left: '15px', top: '32px'}} />
        )}

        <Timeline.Badge bg={badgeColor}>{badgeContent}</Timeline.Badge>
      </Flex>
      {props.children}
    </Flex>
  )
}

const TimelineBadgeInternal = styled(Flex)`
  border-radius: 120px;
`

Timeline.Badge = props => {
  const {size = 32, ...baseProps} = props

  return (
    <TimelineBadgeInternal {...baseProps} height={size} width={size} alignItems="center" justifyContent="center">
      {props.children}
    </TimelineBadgeInternal>
  )
}

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
