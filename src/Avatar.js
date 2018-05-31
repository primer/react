import React from 'react'
import classnames from 'classnames'
import URLSearchParams from 'url-search-params'

const IMAGE_BASE_URL = 'https://avatars.githubusercontent.com/'

function getImageURL(username, params) {
  const query = params ? '?' + new URLSearchParams(params) : ''
  return `${IMAGE_BASE_URL}${username}${query}`
}

const Avatar = props => {
  const {
    username = 'github',
    size = 20,
    isChild,
    ...rest
  } = props

  const params = {
    v: 3, // XXX is this necessary?
    s: size * 2
  }

  const {
    alt = username,
    src = getImageURL(username, params)
  } = rest

  return (
    <img
      className={classnames(
        'avatar',
        {
          'avatar-small': size <= 24,
          'avatar-child': isChild,
        }
      )}
      src={src}
      alt={alt}
      width={size}
      height={size}
    />
  )
}

export default Avatar
export {IMAGE_BASE_URL, getImageURL}
