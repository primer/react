import React from 'react'
import {Meta} from '@storybook/react'
import Box from './Box'

export default {
  title: 'Components/Box',
  component: Box
} as Meta<typeof Box>

export const Default = () => <Box>Box</Box>
