import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {mapWhitespaceProps} from './props'

const colorScheme = (scheme, outline) => {
  if (outline) {
    return {
      'Label--outline-green': scheme === 'green'
    }
  } else {
    return {
      'Label--gray': scheme == null || scheme === 'gray',
      'Label--gray-darker': scheme === 'gray-darker',
      'Label--orange': scheme === 'orange',
      'bg-green': scheme === 'green'
    }
  }
}

export default function Label({outline, scheme, children, ...rest}) {
  const {className} = mapWhitespaceProps(rest)
  return (
    <span className={classnames(className, 'Label', outline && 'Label--outline', colorScheme(scheme, outline))}>
      {children}
    </span>
  )
}

Label.propTypes = {
  children: PropTypes.node,
  outline: PropTypes.bool,
  scheme: PropTypes.oneOf(['gray', 'gray-darker', 'green', 'orange'])
}
