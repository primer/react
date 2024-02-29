import React from 'react'
import type {ComponentMeta} from '@storybook/react'
import Spinner from './Spinner'

export default {
  title: 'Components/Spinner/Features',
  component: Spinner,
} as ComponentMeta<typeof Spinner>

export const Small = () => <Spinner size="small" />

export const Large = () => <Spinner size="large" />
