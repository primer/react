import React from 'react'
import {withSystemProps, LAYOUT, POSITION} from './system-props'

export const Position = withSystemProps('div', LAYOUT.concat(POSITION))

function withPosition(position) {
  const WithPosition = props => <Position {...props} position={position} />
  WithPosition.defaultProps = {...Position.defaultProps}
  delete WithPosition.defaultProps.position
  WithPosition.propTypes = {...Position.propTypes}
  delete WithPosition.propTypes.position
  WithPosition.displayName = `Position.${position}`
  return WithPosition
}

export const Absolute = withPosition('absolute')
export const Fixed = withPosition('fixed')
export const Relative = withPosition('relative')
export const Sticky = withPosition('sticky')
