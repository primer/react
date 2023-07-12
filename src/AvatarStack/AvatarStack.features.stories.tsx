import React from 'react'
import {ComponentMeta} from '@storybook/react'
import AvatarStack from './AvatarStack'
import Avatar from '../Avatar'

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

export const DisableExpandOnHover = () => (
  <AvatarStack disableExpand>
    <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
    <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
    <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
    <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
  </AvatarStack>
)

export const CustomSizeOnParent = () => (
  <AvatarStack size={32}>
    <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
    <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
    <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
    <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
  </AvatarStack>
)

export const CustomSizeOnParentResponsive = () => (
  <AvatarStack size={{narrow: 32, regular: 48, wide: 64}}>
    <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
    <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
    <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
    <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
  </AvatarStack>
)

// the smallest size of the children avatars will be used
export const CustomSizeOnChildren = () => (
  <AvatarStack>
    <Avatar size={20} alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
    <Avatar size={32} alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
    <Avatar size={48} alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
    <Avatar size={64} alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
  </AvatarStack>
)

// the smallest size of the children avatars will be used at each breakpoint
export const CustomSizeOnChildrenResponsive = () => (
  <AvatarStack>
    <Avatar
      size={{narrow: 16, regular: 32, wide: 48}}
      alt="Primer logo"
      src="https://avatars.githubusercontent.com/primer"
    />
    <Avatar
      size={{narrow: 32, regular: 48, wide: 64}}
      alt="GitHub logo"
      src="https://avatars.githubusercontent.com/github"
    />
    <Avatar
      size={{narrow: 48, regular: 64, wide: 96}}
      alt="Atom logo"
      src="https://avatars.githubusercontent.com/atom"
    />
    <Avatar
      size={{narrow: 64, regular: 96, wide: 120}}
      alt="GitHub Desktop logo"
      src="https://avatars.githubusercontent.com/desktop"
    />
  </AvatarStack>
)
