import {ComponentMeta} from '@storybook/react'
import React from 'react'
import Avatar from '../Avatar'
import AvatarStack from './AvatarStack'

export default {
  title: 'Components/AvatarStack/Features',
  component: AvatarStack,
} as ComponentMeta<typeof AvatarStack>

export const AlignLeft = () => (
  <AvatarStack>
    <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
    <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
    <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
    <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
  </AvatarStack>
)

export const AlignRight = () => (
  <AvatarStack alignRight>
    <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
    <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
    <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
    <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
  </AvatarStack>
)
