import React from 'react'
import classnames from 'classnames'

const stateColorMap = Object.freeze({
  open: 'green',
  reopened: 'green',
  closed: 'red',
  merged: 'purple',
})

export default function StateLabel(props) {
  const {
    small,
    is,
    bg,
    className,
    ...rest
  } = props
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

export {stateColorMap}
