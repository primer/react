import React from 'react'
import {ComponentMeta} from '@storybook/react'
import Flash from './Flash'
import {Box} from '..'

export default {
  title: 'Components/Flash/Features',
  component: Flash,
} as ComponentMeta<typeof Flash>

export const Success = () => <Flash variant="success">Success</Flash>

export const Danger = () => <Flash variant="danger">Danger</Flash>

export const Warning = () => <Flash variant="warning">Warning</Flash>

export const Full = () => <Flash full>Full</Flash>

export const WithDefaultLeadingVisual = () => (
  <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
    <Flash renderDefaultVisual>Default</Flash>
    <Flash renderDefaultVisual variant="warning">
      Warning
    </Flash>
    <Flash variant="danger" renderDefaultVisual>
      Danger
    </Flash>
    <Flash variant="success" renderDefaultVisual>
      Success
    </Flash>
  </Box>
)
