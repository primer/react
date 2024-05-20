import React from 'react'
import type {ComponentMeta} from '@storybook/react'
import Spinner from './Spinner'

export default {
  title: 'Components/Spinner/Features',
  component: Spinner,
} as ComponentMeta<typeof Spinner>

export const Small = () => <Spinner size="small" />

export const Large = () => <Spinner size="large" />

export const CustomAlt = () => <Spinner alt="Non-default loading message..." />

export const NoAlt = () => <Spinner alt="" />
