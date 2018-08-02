import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {withSystemProps, COMMON} from './system-props'

const Avatar = ({alt, isChild, size = 20, src}) => {
  const classes = classnames(
    'avatar',
    {
      'avatar-small': size <= 24,
      'avatar-child': isChild
    }
  )

  return <img className={classes} alt={alt} src={src} width={size} height={size} />
}


Avatar.propTypes = {
  alt: PropTypes.string,
  isChild: PropTypes.bool,
  size: PropTypes.number,
  src: PropTypes.string
}

export default withSystemProps(Avatar, COMMON)
