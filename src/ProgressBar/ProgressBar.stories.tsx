import React from 'react'
import {Meta} from '@storybook/react'
import ProgressBar from './ProgressBar'

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
} as Meta<typeof ProgressBar>

export const Default = () => <ProgressBar />
