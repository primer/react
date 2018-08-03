import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {withSystemProps, COMMON} from './system-props'

function Link({children, className, muted, scheme, nounderline, ...rest}) {
  const colorClass = scheme ? `link-${scheme}` : muted ? 'muted-link' : 'text-blue'
  const classes = classnames(className, colorClass, nounderline && 'no-underline')
  return (
    <a className={classes} {...rest}>
      {children}
    </a>
  )
}

Link.propTypes = {
  href: PropTypes.string,
  muted: PropTypes.bool,
  nounderline: PropTypes.bool,
  scheme: PropTypes.oneOf(['gray', 'gray-dark'])
}

export default withSystemProps(Link, COMMON)
