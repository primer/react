import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {withSystemProps, COMMON} from './system-props'

function Tooltip({direction, children, className, text, noDelay, align, wrap}) {
  const classes = classnames(
    className,
    'tooltipped',
    `tooltipped-${direction}`,
    align && `tooltipped-align-${align}-2`,
    noDelay && 'tooltipped-no-delay',
    wrap && 'tooltipped-multiline'
  )
  return (
    <span aria-label={text} className={classes}>
      {children}
    </span>
  )
}

Tooltip.alignments = ['left', 'right']

Tooltip.directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

Tooltip.defaultProps = {
  direction: 'n'
}

Tooltip.propTypes = {
  align: PropTypes.oneOf(Tooltip.alignments),
  children: PropTypes.node,
  direction: PropTypes.oneOf(Tooltip.directions),
  noDelay: PropTypes.bool,
  text: PropTypes.string,
  wrap: PropTypes.bool
}

export default withSystemProps(Tooltip, COMMON)
