import React from 'react'
import type {Meta} from '@storybook/react'
import Spinner from './Spinner'

export default {
  title: 'Components/Spinner/Dev',
  component: Spinner,
} as Meta<typeof Spinner>

export const Default = () => <Spinner sx={{border: '1px solid red'}} size="small" />
