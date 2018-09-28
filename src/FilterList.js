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

export const ITEM_CLASS = 'filter-item'
export const SELECTED_CLASS = 'selected'

function FilterList({children, className, small}) {
  const classes = classnames(className, 'filter-list', small && 'small')

  const items = React.Children.map(children, child => {
    return <li>{child}</li>
  })

  return <ul className={classes}>{items}</ul>
}

Object.assign(FilterList, {ITEM_CLASS, SELECTED_CLASS})

FilterList.defaultProps = {
  m: 0,
  p: 0
}

FilterList.propTypes = {
  children: PropTypes.node,
  small: PropTypes.bool
}

export default withSystemProps(FilterList, COMMON)
