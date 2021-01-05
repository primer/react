import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {POSITION} from './constants'
import Box from './Box'
import theme from './theme'
import sx from './sx'

const Position = styled(Box)`
  ${POSITION};
  ${sx};
`

Position.defaultProps = {
  theme,
}

Position.propTypes = {
  ...Box.propTypes,
  ...POSITION.propTypes,
  theme: PropTypes.object,
  ...sx.propTypes,
}

function withPosition(position) {
  const WithPosition = (props) => <Position {...props} position={position.toLowerCase()} />
  WithPosition.propTypes = Position.propTypes
  WithPosition.defaultProps = Position.defaultProps
  WithPosition.displayName = `Position.${position}`
  return WithPosition
}

export default Position
export const Absolute = withPosition('Absolute')
export const Fixed = withPosition('Fixed')
export const Relative = withPosition('Relative')
export const Sticky = withPosition('Sticky')
Sticky.defaultProps = {
  theme,
  top: 0,
  zIndex: 1,
}
