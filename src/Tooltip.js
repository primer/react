import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const alignmentDirections = ['ne', 'se', 'nw', 'sw']

const Tooltip = ({children, direction, text, noDelay, align, wrap}) => (
  <span
    aria-label={text}
    className={classnames(
      'tooltipped',
      `tooltipped-${direction}`,
      align && `tooltipped-align-${align}-2`,
      noDelay && 'tooltipped-no-delay',
      wrap && 'tooltipped-multiline'
    )}
  >
    {children}
  </span>
)

Tooltip.directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

Tooltip.defaultProps = {
  direction: 'n'
}

Tooltip.propTypes = {
  align: PropTypes.oneOf(alignmentDirections),
  children: PropTypes.node,
  direction: PropTypes.oneOf(Tooltip.directions),
  noDelay: PropTypes.bool,
  text: PropTypes.string,
  wrap: PropTypes.bool
}

export default Tooltip
