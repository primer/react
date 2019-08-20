import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, LAYOUT, POSITION} from './constants'
import theme from './theme'

export const Position = styled.div`
  ${LAYOUT}
  ${COMMON}
  ${POSITION}
`

Position.defaultProps = {
  theme
}

Position.propTypes = {
  ...COMMON.propTypes,
  ...LAYOUT.propTypes,
  ...POSITION.propTypes,
  theme: PropTypes.object
}

function withPosition(position) {
  const WithPosition = props => <Position {...props} position={position} />
  WithPosition.propTypes = Position.propTypes
  WithPosition.defaultProps = Position.defaultProps
  WithPosition.displayName = `Position.${position}`
  return WithPosition
}

export const Absolute = withPosition('absolute')
export const Fixed = withPosition('fixed')
export const Relative = withPosition('relative')
export const Sticky = withPosition('sticky')
Sticky.defaultProps = {
  theme,
  top: 0,
  zIndex: 1
}
