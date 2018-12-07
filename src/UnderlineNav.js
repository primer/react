import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {injectGlobal} from 'emotion'
import styled from 'styled-components'
import sass from 'sass.macro'
import {COMMON} from './constants'
import theme from './theme'

injectGlobal(sass`
  @import "primer-support/index.scss";
  @import "primer-navigation/lib/underline-nav.scss";
`)

const ITEM_CLASS = 'UnderlineNav-item no-underline'
const SELECTED_CLASS = 'selected'

function proto({actions, className, align, children, full, label}) {
  const classes = classnames(className, 'UnderlineNav', align && `UnderlineNav--${align}`, full && 'UnderlineNav--full')
  return (
    <nav className={classes} aria-label={label}>
      <div className="UnderlineNav-body">{children}</div>
      {actions && <div className="UnderlineNav-actions">{actions}</div>}
    </nav>
  )
}

// eslint-disable-next-line no-unused-vars
const UnderlineNavLink = ({className, selected, theme, is: Tag, ...rest}) => {
  const classes = classnames(ITEM_CLASS, selected && SELECTED_CLASS, className)

  if (typeof rest.to === 'string') {
    rest.activeClassName = SELECTED_CLASS
  }

  return <Tag className={classes} {...rest} />
}

const UnderlineNav = styled(proto)(COMMON)

UnderlineNav.Link = styled(UnderlineNavLink)(COMMON)

UnderlineNav.propTypes = {
  actions: PropTypes.node,
  align: PropTypes.oneOf(['right']),
  children: PropTypes.node,
  full: PropTypes.bool,
  label: PropTypes.string,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

UnderlineNav.Link.defaultProps = {
  theme,
  is: 'a'
}

UnderlineNav.Link.propTypes = {
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  selected: PropTypes.bool,
  ...COMMON.propTypes
}

export default UnderlineNav
