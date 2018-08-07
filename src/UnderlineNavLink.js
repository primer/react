import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {ITEM_CLASS, SELECTED_CLASS} from './UnderlineNav'
import {withSystemProps, COMMON} from './system-props'

function UnderlineNavLink({className, selected, tag: Tag, ...rest}) {
  const classes = classnames(ITEM_CLASS, selected && SELECTED_CLASS, className)

  if (typeof rest.to === 'string') {
    rest.activeClassName = SELECTED_CLASS
  }

  return <Tag className={classes} {...rest} />
}

UnderlineNavLink.defaultProps = {
  tag: 'a'
}

UnderlineNavLink.propTypes = {
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  selected: PropTypes.bool
}

export default withSystemProps(UnderlineNavLink, COMMON)
