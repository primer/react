import React from 'react'
import classnames from 'classnames'

const alignmentDirections = ['ne', 'se', 'nw', 'sw']

const Tooltip = ({ children, direction, text, noDelay, align, wrap }) => (
  <span
    aria-label={text}
    className={classnames(
      'tooltipped',
      `tooltipped-${direction || 'n'}`,
      align && alignmentDirections.includes(direction)  ? `tooltipped-align-${align}-2` : '',
      {
        'tooltipped-no-delay': noDelay,
        'tooltipped-multiline': wrap
      }
    )}>
    { children }
  </span>
)

Tooltip.directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

export default Tooltip
