import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {ITEM_CLASS, SELECTED_CLASS} from './UnderlineNav'
import {mapWhitespaceProps} from './props'

export default function UnderlineNavLink({children, selected, tag: Tag, ...rest}) {
  const {className} = mapWhitespaceProps(rest)
  const classes = classnames(ITEM_CLASS, selected && SELECTED_CLASS, className)

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  )
}

UnderlineNavLink.displayName = 'UnderlineNavLink'

UnderlineNavLink.defaultProps = {
  tag: 'a'
}

UnderlineNavLink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  selected: PropTypes.bool,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
}
