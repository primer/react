import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import sass from 'sass.macro'
import {injectGlobal} from 'emotion'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'

injectGlobal(sass`
  @import "primer-support/index.scss";
  @import "primer-navigation/lib/filter-list.scss";
`)

const ITEM_CLASS = 'filter-item'
const SELECTED_CLASS = 'selected'

function FilterListProto({children, className, small}) {
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

function ItemProto({children, className, count, selected, theme, is: Tag, ...rest}) { //eslint-disable-line no-unused-vars
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

const FilterList = styled(FilterListProto)(COMMON)
FilterList.Item = styled(ItemProto)(COMMON)

FilterList.defaultProps = {
  theme,
  m: 0,
  p: 0
}

FilterList.propTypes = {
  children: PropTypes.node,
  small: PropTypes.bool,
  ...COMMON.propTypes
}

FilterList.Item.defaultProps = {
  theme,
  is: 'a'
}

FilterList.Item.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  count: PropTypes.string,
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  selected: PropTypes.bool,
  ...COMMON.propTypes
}

export default FilterList
