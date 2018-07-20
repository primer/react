import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {mapWhitespaceProps} from './props'

const schemeMap = {
  green: 'success',
  red: 'error',
  yellow: 'warn'
}

export default function Flash({children, full, scheme, ...rest}) {
  const {className} = mapWhitespaceProps(rest)
  return (
    <div className={classnames(className, 'flash', full && 'flash-full', scheme && `flash-${schemeMap[scheme]}`)}>
      {children}
    </div>
  )
}

Flash.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  full: PropTypes.bool,
  scheme: PropTypes.oneOf(Object.keys(schemeMap))
}
