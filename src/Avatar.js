import React, {Component} from 'react'
import classnames from 'classnames'

export default function Avatar(props) {
  const {
    username,
    size = 20,
    baseURL = 'https://avatars.githubusercontent.com/',
    alt,
    params,
    ...rest
  } = props
  const query = new URLSearchParams(params)
  query.set('v', 3) // is this necessary?
  query.set('s', size)
  const src = `${baseURL}${username || 'github'}?${params}`
  return (
    <img {...props} src={src} width={size} height={size} alt={alt || username}/>
  )
}
