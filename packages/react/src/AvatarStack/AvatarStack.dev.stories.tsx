import React from 'react'
import type {Meta} from '@storybook/react'
import {Avatar, AvatarStack} from '..'
import {sxOverrideTestStyles} from '../utils/story-helpers'

export default {
  title: 'Components/AvatarStack/Dev',
  component: AvatarStack,
} as Meta<typeof AvatarStack>

export const SxPropStressTest = () => (
  <AvatarStack sx={sxOverrideTestStyles}>
    <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
    <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
    <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
    <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
  </AvatarStack>
)
