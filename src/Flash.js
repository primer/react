import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const schemeMap = {
  green: 'success',
  red: 'error',
  yellow: 'warn'
}

export default function Flash({children, className, full, scheme}) {
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
