import React from 'react'
import classnames from 'classnames'

const Avatar = props => {
  const {
    username,
    size = 20,
    baseURL = 'https://avatars.githubusercontent.com/',
    alt,
    child,
    ...rest
  } = props
  const query = new URLSearchParams({
    v: 3, // XXX is this necessary?
    s: size * 2
  })
  return (
    <img
      className={classnames(
        'avatar',
        {
          'avatar-small': size <= 48,
          'avatar-child': child,
        }
      )}
      src={`${baseURL}${username || 'github'}?${query}`}
      width={size}
      height={size}
      alt={alt || username}
    />
  )
}

export default Avatar
