import React from 'react'
import type {Meta} from '@storybook/react'
import {Avatar} from '..'
import {sxOverrideTestStyles} from '../utils/story-helpers'

export default {
  title: 'Components/Avatar/Dev',
  component: Avatar,
} as Meta<typeof Avatar>

export const SxPropStressTest = () => (
  <Avatar sx={sxOverrideTestStyles} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
)
