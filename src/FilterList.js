import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import sass from 'sass.macro'
import {injectGlobal} from 'emotion'
import {withSystemProps, COMMON} from './system-props'

injectGlobal(sass`
  @import "primer-support/index.scss";
  @import "primer-navigation/lib/filter-list.scss";
`)

const ITEM_CLASS = 'filter-item'
const SELECTED_CLASS = 'selected'

function FilterList({children, className, small}) {
  const classes = classnames(className, 'filter-list', small && 'small')

  const items = React.Children.map(children, child => {
    return <li>{child}</li>
  })

  return <ul className={classes}>{items}</ul>
}

function getCountComponent(count) {
  return (
    <span className="count" title="results">
      {count}
    </span>
  )
}

function Item({children, className, count, selected, is: Tag, ...rest}) {
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

Item.defaultProps = {
  is: 'a'
}

Item.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  count: PropTypes.string,
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  selected: PropTypes.bool
}

FilterList.defaultProps = {
  m: 0,
  p: 0
}

FilterList.propTypes = {
  children: PropTypes.node,
  small: PropTypes.bool
}

FilterList.Item = withSystemProps(Item, COMMON)

export default withSystemProps(FilterList, COMMON)
