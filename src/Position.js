import React from 'react'
import {withSystemProps, LAYOUT, COMMON, POSITION} from './system-props'

export const Position = withSystemProps('div', [...LAYOUT, ...COMMON, ...POSITION])

function withPosition(position) {
  const WithPosition = props => <Position {...props} position={position} />
  WithPosition.propTypes = Position.propTypes
  WithPosition.displayName = `Position.${position}`
  return WithPosition
}

export const Absolute = withPosition('absolute')
export const Fixed = withPosition('fixed')
export const Relative = withPosition('relative')
export const Sticky = withPosition('sticky')
Sticky.defaultProps = {
  top: 0,
  zIndex: 1
}
