import React from 'react'
import classnames from 'classnames'

const CounterLabel = ({className, bg, children}) => (
    <span
      className={classnames(
        className,
        'Counter',
        bg ? `Counter--${bg}` : null,
      )}
    >
      {children}
    </span>
)

export default CounterLabel
