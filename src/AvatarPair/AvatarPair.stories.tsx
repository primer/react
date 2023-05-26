import {ComponentMeta} from '@storybook/react'
import React from 'react'
import Avatar from '../Avatar'
import AvatarPair from './AvatarPair'

export default {
  title: 'Components/AvatarPair',
  component: AvatarPair,
} as ComponentMeta<typeof AvatarPair>

export const Default = () => (
  <AvatarPair>
    <Avatar src="https://avatars.githubusercontent.com/u/92997159?v=4" />
    <Avatar src="https://avatars.githubusercontent.com/primer" />
  </AvatarPair>
)
