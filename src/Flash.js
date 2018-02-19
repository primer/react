import React from 'react'
import classnames from 'classnames'

const Flash = props => (
    <div
      {...props}
      className={classnames(
        props.className,
        'flash', {
          'flash-full': props.full,
          'flash-warn': props.yellow,
          'flash-error': props.red,
          'flash-success': props.green,       }
      )}
    />
)

export default Flash
