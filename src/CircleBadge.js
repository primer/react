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
  @import "primer-avatars/lib/circle-badge.scss";
`)

const ICON_CLASS = 'CircleBadge-icon'

const sizeMapper = (size = 'medium') => {
  if (typeof size === 'number') return size
  const map = {
    small: 56,
    medium: 96,
    large: 128
  }
  return map[size]
}

const sizeStyles = ({size}) => {
  return {
    width: sizeMapper(size),
    height: sizeMapper(size)
  }
}

const proto = ({children, is: Tag, className, ...rest}) => {
  const mappedChildren = React.Children.map(children, child => {
    let {className = ''} = child.props
    if (!className.includes(ICON_CLASS)) {
      className = classnames(ICON_CLASS, className)
    }
    return React.cloneElement(child, {className})
  })

  const classes = classnames(className, 'CircleBadge')
  return (
    <Tag className={classes} {...rest}>
      {mappedChildren}
    </Tag>
  )
}

const CircleBadge = styled(proto)`
  ${COMMON} ${sizeStyles};
`

CircleBadge.defaultProps = {
  theme,
  is: 'div'
}

CircleBadge.propTypes = {
  bg: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.oneOf(['small', 'medium', 'large']), PropTypes.number])
}

export default CircleBadge
