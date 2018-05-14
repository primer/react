import React from 'react'
import classnames from 'classnames'

const Counter = props => (
    <span
      {...props}
      className={classnames(
        props.className,
        'Counter', {
          'Counter--gray': props.gray,
          'Counter--gray': props.graylight,
        }
      )}
    />
)

export default Counter
