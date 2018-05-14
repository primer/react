import React from 'react'
import classnames from 'classnames'

const stateColorMap = Object.freeze({
  open: 'green',
  reopened: 'green',
  closed: 'red',
  merged: 'purple',
})

const State = ({small, is, bg, className, ...rest}) => {
  const color = bg || stateColorMap[is]
  return (
    <div {...rest} className={classnames(
      className,
      'State', {
        'State--small': small
      },
      color ? `State--${color}` : null
    )}/>
  )
}

export default State
export {stateColorMap}
