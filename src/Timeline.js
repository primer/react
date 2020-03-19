import {COMMON, get} from './constants'
import styled, {css} from 'styled-components'

import Box from './Box'
import Flex from './Flex'
import PropTypes from 'prop-types'
import React from 'react'
import {Relative} from './Position'
import classnames from 'classnames'
import theme from './theme'

const Timeline = styled(Flex)`
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
`

Timeline.Item = styled(Flex).attrs(props => ({
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
`

Timeline.Badge = props => {
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
  ...Flex.propTypes
}

Timeline.Item.defaultProps = {
  theme
}

Timeline.Item.propTypes = {
  children: PropTypes.node,
  condensed: PropTypes.bool,
  theme: PropTypes.object,
  ...Flex.propTypes
}

Timeline.Badge.defaultProps = {
  theme
}

Timeline.Badge.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.object,
  ...Flex.propTypes
}

Timeline.Body.defaultProps = {
  theme
}

Timeline.Body.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.object,
  ...Box.propTypes
}

Timeline.Break.defaultProps = {
  theme
}

Timeline.Break.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.object,
  ...Box.propTypes
}

export default Timeline
