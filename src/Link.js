import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default function Link({children, className, muted, scheme, nounderline, ...rest}) {
  return (
    <a
      className={classnames(
        className,
        'text-blue',
        muted && 'muted-link',
        scheme && `link-${scheme}`,
        nounderline && 'no-underline'
      )}
      {...rest}
    >
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
