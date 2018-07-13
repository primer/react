import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const CircleBadge = ({tag: Tag = 'div', size = 'medium', bg, children, ...rest}) => {
  const generateContent = () =>
    React.Children.map(children, child => {
      const {className = '', ...rest} = child.props
      const newProps = {...rest}
      if (!className || !className.includes('CircleBadge-icon')) {
        newProps.className = classnames('CircleBadge-icon', className)
      }
      return React.cloneElement(child, newProps)
    })
  const classes = classnames('CircleBadge', `CircleBadge--${size}`, bg && `bg-${bg}`)
  return (
    <Tag className={classes} {...rest}>
      {generateContent()}
    </Tag>
  )
}

CircleBadge.propTypes = {
  alt: PropTypes.string,
  bg: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  src: PropTypes.string
}

export default CircleBadge
