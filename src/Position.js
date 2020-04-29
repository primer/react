import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, LAYOUT, POSITION} from './constants'
import theme from './theme'
import sx from './sx'

export const Position = styled.div`
  ${LAYOUT}
  ${COMMON}
  ${POSITION}
  ${sx};
`

Position.defaultProps = {
  theme
}

Position.propTypes = {
  ...COMMON.propTypes,
  ...LAYOUT.propTypes,
  ...POSITION.propTypes,
  ...sx.propTypes,
  theme: PropTypes.object
}

function withPosition(position) {
  const WithPosition = props => <Position {...props} position={position.toLowerCase()} />
  WithPosition.propTypes = Position.propTypes
  WithPosition.defaultProps = Position.defaultProps
  WithPosition.displayName = `Position.${position}`
  return WithPosition
}

export const Absolute = withPosition('Absolute')
export const Fixed = withPosition('Fixed')
export const Relative = withPosition('Relative')
export const Sticky = withPosition('Sticky')
Sticky.defaultProps = {
  theme,
  top: 0,
  zIndex: 1
}
