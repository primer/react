import React from 'react'
import classnames from 'classnames'

const Counter = ({className, bg, ...props}) => (
    <span
      {...props}
      className={classnames(
        className,
        'Counter',
        bg ? `Counter--${bg}` : null,
      )}
    />
)

export default Counter
