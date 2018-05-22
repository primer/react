import React from 'react'
import classnames from 'classnames'

const IMAGE_BASE_URL = 'https://avatars.githubusercontent.com/'

const Avatar = props => {
  const {
    username,
    size = 20,
    baseURL = IMAGE_BASE_URL,
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
          'avatar-small': size <= 24,
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
export {IMAGE_BASE_URL}
