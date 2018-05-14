import React from 'react'
import classnames from 'classnames'

const CounterLabel = ({className, bg, ...props}) => (
    <span
      {...props}
      className={classnames(
        className,
        'Counter',
        bg ? `Counter--${bg}` : null,
      )}
    />
)

export default CounterLabel
