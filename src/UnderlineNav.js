import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default function UnderlineNav(props) {
  const {actions, align, children, full, label} = props

  return (
    <nav
      className={classnames('UnderlineNav', align && `UnderlineNav--${align}`, full && 'UnderlineNav--full')}
      aria-label={label}
    >
      <div className="UnderlineNav-body">{children}</div>
      {actions && <div className="UnderlineNav-actions">{actions}</div>}
    </nav>
  )
}

UnderlineNav.propTypes = {
  actions: PropTypes.node,
  align: PropTypes.oneOf(['right']),
  children: PropTypes.node,
  full: PropTypes.bool,
  label: PropTypes.string
}
