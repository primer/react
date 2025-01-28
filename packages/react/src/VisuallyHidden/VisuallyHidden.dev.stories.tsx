import React from 'react'
import type {Meta} from '@storybook/react'
import {VisuallyHidden} from './VisuallyHidden'

export default {
  title: 'Components/VisuallyHidden/Dev',
  component: VisuallyHidden,
} as Meta<typeof VisuallyHidden>

export const Default = () => (
  <div>
    <span>Visible Text</span>
    <VisuallyHidden>Visually Hidden Text</VisuallyHidden>
  </div>
)
