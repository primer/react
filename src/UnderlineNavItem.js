import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default function UnderlineNavItem(props) {
  const {children, className: defaultClassName, tag: Tag = 'a', underline, ...rest} = props
  const className = classnames('UnderlineNav-item', !underline && 'no-underline', 'px-3', defaultClassName)

  return (
    <Tag className={className} activeClassName="selected" {...rest}>
      {children}
    </Tag>
  )
}

UnderlineNavItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  underline: PropTypes.bool
}
