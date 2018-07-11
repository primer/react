import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const CircleBadge = ({tag: Tag = 'div', alt = '', size = 'medium', src, bg, children, ...rest}) => {
  const generateContent = () => {
    if (src) {
      return <img className='CircleBadge-icon' alt={alt} src={src} />
    } else if (children) {
      return <div className='CircleBadge-icon'>{children}</div>
    } else return null
  }
  const classes = classnames('CircleBadge', `CircleBadge--${size}`, bg && `bg-${bg}`)
  return (
    <Tag className={classes} {...rest}>
      {generateContent()}
    </Tag>
  )
}

CircleBadge.propTypes = {
  alt: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  src: PropTypes.string,
  bg: PropTypes.string
}

export default CircleBadge
