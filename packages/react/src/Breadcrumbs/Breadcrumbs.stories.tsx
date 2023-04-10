import React from 'react'
import {Meta} from '@storybook/react'
import {ComponentProps} from '../utils/types'
import Breadcrumbs from './Breadcrumbs'

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
} as Meta<ComponentProps<typeof Breadcrumbs>>

export const Default = () => (
  <Breadcrumbs>
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Team
    </Breadcrumbs.Item>
  </Breadcrumbs>
)
