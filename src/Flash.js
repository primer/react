import React from 'react'
import classnames from 'classnames'

export default function Flash({children, className, full, yellow, red, green}) {
  return (
    <div
      className={classnames(className, 'flash', {
        'flash-full': full,
        'flash-warn': yellow,
        'flash-error': red,
        'flash-success': green
      })}
    >
      {children}
    </div>
  )
}
