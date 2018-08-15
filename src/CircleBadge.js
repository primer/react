import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {withSystemProps, COMMON} from './system-props'

const ICON_CLASS = 'CircleBadge-icon'

const CircleBadge = ({is: Tag = 'div', size, bg, children, className, ...rest}) => {
  const mappedChildren = React.Children.map(children, child => {
    let {className = ''} = child.props
    if (!className.includes(ICON_CLASS)) {
      className = classnames(ICON_CLASS, className)
    }
    return React.cloneElement(child, {className})
  })

  let sizeClassName = null
  if (typeof size === 'string') {
    sizeClassName = `CircleBadge--${size}`
  }
  const classes = classnames(className, 'CircleBadge', sizeClassName, bg && `bg-${bg}`)
  return (
    <Tag className={classes} {...rest}>
      {mappedChildren}
    </Tag>
  )
}

CircleBadge.propTypes = {
  alt: PropTypes.string,
  bg: PropTypes.string,
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  size: PropTypes.oneOfType([PropTypes.oneOf(['small', 'medium', 'large']), PropTypes.number]),
  src: PropTypes.string
}

export default withSystemProps(CircleBadge, [...COMMON, 'size'])
