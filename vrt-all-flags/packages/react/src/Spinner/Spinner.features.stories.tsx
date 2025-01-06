import React from 'react'
import type {Meta} from '@storybook/react'
import Spinner from './Spinner'
import {Box} from '..'
import {AriaStatus} from '../live-region'

export default {
  title: 'Components/Spinner/Features',
  component: Spinner,
} as Meta<typeof Spinner>

export const Small = () => <Spinner size="small" />

export const Large = () => <Spinner size="large" />

export const SuppressScreenReaderText = () => (
  <Box sx={{alignItems: 'center', display: 'flex', gap: '0.25rem'}}>
    <Spinner size="small" srText={null} />
    <AriaStatus>Loading...</AriaStatus>
  </Box>
)
