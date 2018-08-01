import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {ITEM_CLASS, SELECTED_CLASS} from './FilterList'
import {mapWhitespaceProps} from './props'

function getCountComponent(count) {
  return (
    <span className="count" title="results">
      {count}
    </span>
  )
}

export default function FilterListItem({children, count, selected, tag: Tag, ...rest}) {
  const {className} = mapWhitespaceProps(rest)
  const classes = classnames(ITEM_CLASS, selected && SELECTED_CLASS, className)

  if (typeof rest.to === 'string') {
    rest.activeClassName = SELECTED_CLASS
  }

  return (
    <Tag className={classes} {...rest}>
      {count && getCountComponent(count)}
      {children}
    </Tag>
  )
}

FilterListItem.defaultProps = {
  tag: 'a'
}

FilterListItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  count: PropTypes.string,
  selected: PropTypes.bool,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
}
