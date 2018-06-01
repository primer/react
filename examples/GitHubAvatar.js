import React from 'react'
import {Avatar} from '../src'

export default function GitHubAvatar({username, size = 20, ...rest}) {
  return (
    <Avatar
      src={`https://avatars.githubusercontent.com/${username}?v=3&s=${size * 2}`}
      size={size}
      {...rest}
    />
  )
}
