import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import AvatarStack from './AvatarStack'
import Avatar from '../Avatar'

export default {
  title: 'Components/AvatarStack',
  component: AvatarStack,
} as ComponentMeta<typeof AvatarStack>

export const Default = () => (
  <AvatarStack>
    <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
    <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
    <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
    <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
  </AvatarStack>
)

export const Playground: ComponentStory<typeof Avatar> = args => (
  <AvatarStack {...args}>
    <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
    <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
    <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
    <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
  </AvatarStack>
)

Playground.argTypes = {
  sx: {
    controls: false,
    table: {
      disable: true,
    },
  },
}
