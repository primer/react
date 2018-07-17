import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import UnderlineNavLink from './UnderlineNavLink'
import {mapWhitespaceProps} from './props'

export const ITEM_CLASS = 'UnderlineNav-item no-underline'
export const SELECTED_CLASS = 'selected'

export default function UnderlineNav(props) {
  const {actions, align, children, full, label, ...rest} = props
  const {className} = mapWhitespaceProps(rest)
  const classes = classnames(className, 'UnderlineNav', align && `UnderlineNav--${align}`, full && 'UnderlineNav--full')

  const mappedChildren = React.Children.map(children, child => {
    if (child.type === UnderlineNavLink) {
      return child
    }

    const {className = '', selected} = child.props
    const newProps = {}
    // add the ITEM_CLASS to all children without one
    if (!className || !className.includes(ITEM_CLASS)) {
      newProps.className = classnames(ITEM_CLASS, className)
    }
    if (selected === true && !className.includes(SELECTED_CLASS)) {
      newProps.className = classnames(newProps.className || className, SELECTED_CLASS)
    }
    // if this is a react-router NavLink (duck typing!),
    // set activeClassName={SELECTED_CLASS}
    if (child.type.name === 'NavLink') {
      newProps.activeClassName = SELECTED_CLASS
    }
    return React.cloneElement(child, newProps)
  })

  return (
    <nav className={classes} aria-label={label}>
      <div className="UnderlineNav-body">{mappedChildren}</div>
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
