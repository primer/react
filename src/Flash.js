import React from 'react'
import classnames from 'classnames'

const Flash = ({children, className, full, yellow, red, green}) => (
  <div
    className={classnames(
      className,
      'flash', {
        'flash-full': full,
        'flash-warn': yellow,
        'flash-error': red,
        'flash-success': green
      }
    )}>
    {children}
  </div>
)

export default Flash
