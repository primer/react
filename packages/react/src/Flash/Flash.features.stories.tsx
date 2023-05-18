import React from 'react'
import {ComponentMeta} from '@storybook/react'
import Flash from './Flash'

export default {
  title: 'Components/Flash/Features',
  component: Flash,
} as ComponentMeta<typeof Flash>

export const Success = () => <Flash variant="success">Success</Flash>

export const Danger = () => <Flash variant="danger">Danger</Flash>

export const Warning = () => <Flash variant="warning">Warning</Flash>

export const Full = () => <Flash full>Full</Flash>
