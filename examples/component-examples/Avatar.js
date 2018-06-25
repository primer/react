import React from 'react'
import { Block } from '../../src'
import GitHubAvatar from '../doc-components/GitHubAvatar'

const AvatarExample =
  {
    name: 'Avatar',
    element: (
      <div>
        <Block mb={2}>
          <GitHubAvatar username='primer' size={128} />
        </Block>
        <Block mb={2}>
          <GitHubAvatar username='github' size={64} />
        </Block>
        <Block mb={2}>
          <GitHubAvatar username='reactjs' size={32} />
          {' '}
          <GitHubAvatar username='npm' />
        </Block>
      </div>
    )
  }

export default AvatarExample
