import React from 'react'
import {ComponentMeta} from '@storybook/react'
import Avatar from './Avatar'

export default {
  title: 'Components/Avatar/Features',
  component: Avatar,
} as ComponentMeta<typeof Avatar>

export const Square = () => <Avatar square src="https://avatars.githubusercontent.com/primer" />

export const Size = () => (
  <div>
    <Avatar size={4} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
    <Avatar size={8} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
    <Avatar size={12} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
    <Avatar size={16} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
    <Avatar size={20} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
    <Avatar size={24} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
    <Avatar size={28} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
    <Avatar size={32} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
    <Avatar size={40} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
    <Avatar size={48} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
    <Avatar size={56} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
    <Avatar size={64} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
  </div>
)
