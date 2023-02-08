import React from 'react'
import {Meta} from '@storybook/react'
import {ComponentProps} from '../utils/types'
import Flash from './Flash'

export default {
  title: 'Components/Flash/Features',
  component: Flash,
} as Meta<ComponentProps<typeof Flash>>

export const Success = () => <Flash variant="success">Success</Flash>

export const Danger = () => <Flash variant="danger">Danger</Flash>

export const Warning = () => <Flash variant="warning">Warning</Flash>

export const Full = () => <Flash full>Full</Flash>
