import React from 'react'
import classnames from 'classnames'

const CounterLabel = ({ theme, children}) => (
    <span
      className={classnames(
        'Counter',
        theme ? `Counter--${theme}` : null,
      )}
    >
      {children}
    </span>
)

export default CounterLabel
