import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {ITEM_CLASS, SELECTED_CLASS} from './UnderlineNav'
import {mapWhitespaceProps} from './props'

export default function UnderlineNavLink(props) {
  const {children, className: defaultClassName, selected, tag: Tag, ...rest} = mapWhitespaceProps(props)

  const className = classnames(defaultClassName, ITEM_CLASS, selected && SELECTED_CLASS)

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
  selected: PropTypes.bool,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
}
