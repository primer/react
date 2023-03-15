import React from 'react'
import {Meta} from '@storybook/react'
import Spinner from './Spinner'

export default {
  title: 'Components/Spinner',
  component: Spinner,
} as Meta<typeof Spinner>

export const Default = () => <Spinner />
