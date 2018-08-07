import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {ITEM_CLASS, SELECTED_CLASS} from './UnderlineNav'
import {withSystemProps, COMMON} from './system-props'

function UnderlineNavLink({className, selected, is: Tag, ...rest}) {
  const classes = classnames(ITEM_CLASS, selected && SELECTED_CLASS, className)

  if (typeof rest.to === 'string') {
    rest.activeClassName = SELECTED_CLASS
  }

  return <Tag className={classes} {...rest} />
}

UnderlineNavLink.defaultProps = {
  is: 'a'
}

UnderlineNavLink.propTypes = {
  selected: PropTypes.bool,
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
}

export default withSystemProps(UnderlineNavLink, COMMON)
