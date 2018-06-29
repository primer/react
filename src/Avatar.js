import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const Avatar = props => {
  const {alt, isChild, size = 20, src} = props

  const className = classnames('avatar', {
    'avatar-small': size <= 24,
    'avatar-child': isChild
  })

  return <img className={className} alt={alt} src={src} width={size} height={size} />
}

Avatar.propTypes = {
  alt: PropTypes.string,
  isChild: PropTypes.bool,
  size: PropTypes.number,
  src: PropTypes.string
}

export default Avatar
