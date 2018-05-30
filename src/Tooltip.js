import React from 'react'
import classnames from 'classnames'

const Tooltip = ({ children, direction, text, noDelay, align, wrap }) => (
  <span
    aria-label={text}
    className={classnames(
      'tooltipped',
      `tooltipped-${direction || 'n'}`,
      align && ['ne', 'se', 'nw', 'sw'].includes(direction)  ? `tooltipped-align-${align}-2` : '',
      {
        'tooltipped-no-delay': noDelay,
        'tooltipped-multiline': wrap
      }
    )}>
    { children }
  </span>
)

export default Tooltip
