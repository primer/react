import React from 'react'
import {Meta} from '@storybook/react'
import Pagehead from './Pagehead'

export default {
  title: 'Components/Pagehead',
  component: Pagehead,
} as Meta<typeof Pagehead>

export const Default = () => <Pagehead>Pagehead</Pagehead>
