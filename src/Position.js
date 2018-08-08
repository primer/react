import React from 'react'
import {withSystemProps, LAYOUT, POSITION} from './system-props'

const Position = withSystemProps('div', LAYOUT.concat(POSITION))

export default Position

function withPosition(position) {
  const WithPosition = props => <Position {...props} position={position} />
  WithPosition.defaultProps = {...Position.defaultProps}
  delete WithPosition.defaultProps.position
  WithPosition.propTypes = {...Position.propTypes}
  delete WithPosition.propTypes.position
  WithPosition.displayName = `Position.${position}`
  return WithPosition
}

const Absolute = withPosition('absolute')
const Fixed = withPosition('fixed')
const Relative = withPosition('relative')
const Sticky = withPosition('sticky')

export {Absolute, Fixed, Relative, Sticky}
