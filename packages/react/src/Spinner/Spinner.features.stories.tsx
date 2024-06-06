import React from 'react'
import type {ComponentMeta} from '@storybook/react'
import Spinner from './Spinner'
import {Box} from '..'

export default {
  title: 'Components/Spinner/Features',
  component: Spinner,
} as ComponentMeta<typeof Spinner>

export const Small = () => <Spinner size="small" />

export const Large = () => <Spinner size="large" />

export const SuppressScreenReaderText = () => (
  <Box sx={{alignItems: 'center', display: 'flex', gap: '0.25rem'}}>
    <Spinner size="small" srText={null} />
    <span role="status">Loading...</span>
  </Box>
)
