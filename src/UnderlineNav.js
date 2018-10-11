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

const ITEM_CLASS = 'UnderlineNav-item no-underline'
const SELECTED_CLASS = 'selected'

function UnderlineNav({actions, className, align, children, full, label}) {
  const classes = classnames(className, 'UnderlineNav', align && `UnderlineNav--${align}`, full && 'UnderlineNav--full')
  return (
    <nav className={classes} aria-label={label}>
      <div className="UnderlineNav-body">{children}</div>
      {actions && <div className="UnderlineNav-actions">{actions}</div>}
    </nav>
  )
}

const UnderlineNavLink = ({className, selected, is: Tag, ...rest}) => {
  const classes = classnames(ITEM_CLASS, selected && SELECTED_CLASS, className)

  if (typeof rest.to === 'string') {
    rest.activeClassName = SELECTED_CLASS
  }

  return <Tag className={classes} {...rest} />
}

UnderlineNav.propTypes = {
  actions: PropTypes.node,
  align: PropTypes.oneOf(['right']),
  children: PropTypes.node,
  full: PropTypes.bool,
  label: PropTypes.string
}

UnderlineNavLink.defaultProps = {
  is: 'a'
}

UnderlineNavLink.propTypes = {
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  selected: PropTypes.bool
}

UnderlineNav.Link = withSystemProps(UnderlineNavLink, COMMON)


export default withSystemProps(UnderlineNav, COMMON)
