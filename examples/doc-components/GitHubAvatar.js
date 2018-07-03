import React from 'react'
import PropTypes from 'prop-types'
import {Avatar} from '../../src'

export default function GitHubAvatar({username, size, ...rest}) {
  return <Avatar src={`https://avatars.githubusercontent.com/${username}?v=3&s=${size * 2}`} size={size} {...rest} />
}

GitHubAvatar.defaultProps = {
  size: 20
}

GitHubAvatar.propTypes = {
  username: PropTypes.string,
  ...Avatar.propTypes
}

delete GitHubAvatar.propTypes.src
