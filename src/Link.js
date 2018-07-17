import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {mapWhitespaceProps} from './props'

export default function Link(props) {
  const {children, className, muted, scheme, nounderline, ...rest} = mapWhitespaceProps(props)
  const colorClass = scheme ? `link-${scheme}` : muted ? 'muted-link' : 'text-blue'
  return (
    <a className={classnames(className, colorClass, nounderline && 'no-underline')} {...rest}>
      {children}
    </a>
  )
}

Link.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  href: PropTypes.string,
  muted: PropTypes.bool,
  nounderline: PropTypes.bool,
  scheme: PropTypes.oneOf(['gray', 'gray-dark'])
}
