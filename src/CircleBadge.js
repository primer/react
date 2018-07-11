import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const CircleBadge = ({alt, size = 'medium', src, bg, children}) => {
  const generateContent = () => {
    if (src) {
      return <img className="CircleBadge-icon" alt={alt} src={src} />
    } else if (children) {
      return children
    } else return null
  }
  const classes = classnames('CircleBadge', `CircleBadge--${size}`, bg && `bg-${bg}`)
  return (
    <div className={classes}>
      {generateContent()}
    </div>
  )
}

CircleBadge.propTypes = {
  alt: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  src: PropTypes.string,
  bg: PropTypes.string
}

export default CircleBadge
