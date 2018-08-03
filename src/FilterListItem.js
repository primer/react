import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {ITEM_CLASS, SELECTED_CLASS} from './FilterList'
import {withSystemProps, COMMON} from './system-props'

function getCountComponent(count) {
  return (
    <span className="count" title="results">
      {count}
    </span>
  )
}

function FilterListItem({children, className, count, selected, is: Tag, ...rest}) {
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
  is: 'a'
}

FilterListItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  count: PropTypes.string,
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  selected: PropTypes.bool
}

export default withSystemProps(FilterListItem, COMMON)
