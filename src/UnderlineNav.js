import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {injectGlobal} from 'emotion'
import sass from 'sass.macro'
import {withSystemProps, COMMON} from './system-props'

injectGlobal(sass`
  @import "primer-support/index.scss";
  @import "primer-navigation/lib/underline-nav.scss";
`)

export const ITEM_CLASS = 'UnderlineNav-item no-underline'
export const SELECTED_CLASS = 'selected'

function UnderlineNav({actions, className, align, children, full, label}) {
  const classes = classnames(className, 'UnderlineNav', align && `UnderlineNav--${align}`, full && 'UnderlineNav--full')
  return (
    <nav className={classes} aria-label={label}>
      <div className="UnderlineNav-body">{children}</div>
      {actions && <div className="UnderlineNav-actions">{actions}</div>}
    </nav>
  )
}

// make it possible to destructure these from UnderlineNav:
// const {ITEM_CLASS} = UnderlineNav
Object.assign(UnderlineNav, {ITEM_CLASS, SELECTED_CLASS})

UnderlineNav.propTypes = {
  actions: PropTypes.node,
  align: PropTypes.oneOf(['right']),
  children: PropTypes.node,
  full: PropTypes.bool,
  label: PropTypes.string
}

export default withSystemProps(UnderlineNav, COMMON)
