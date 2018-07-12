import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {ITEM_CLASS} from './UnderlineNav'
import {mapWhitespaceProps} from './props'

export default function UnderlineNavLink(props) {
  const {children, className: defaultClassName, tag: Tag, ...rest} = mapWhitespaceProps(props)
  const className = classnames(defaultClassName, ITEM_CLASS)

  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  )
}

UnderlineNavLink.defaultProps = {
  tag: 'a'
}

UnderlineNavLink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
}
