import React from 'react'
import classnames from 'classnames'

const CounterLabel = ({ bg, children}) => (
    <span
      className={classnames(
        'Counter',
        bg ? `Counter--${bg}` : null,
      )}
    >
      {children}
    </span>
)

export default CounterLabel
