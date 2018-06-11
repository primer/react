import React from 'react'
import {Example} from '@compositor/kit'
import {Avatar, Block} from '../src'
import {GitHubAvatar} from '../lib'

export default () => (
  <Block>
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
  </Block>
)
