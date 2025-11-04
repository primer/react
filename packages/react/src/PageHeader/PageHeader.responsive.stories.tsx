import type {Meta, StoryFn} from '@storybook/react-vite'
import React from 'react'
import {PageHeader} from './PageHeader'

const meta: Meta = {
  title: 'Components/PageHeader/Responsive Variants',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
}

export default meta

/**
 * Test responsive size variants on TitleArea.
 * Resize the viewport to see different title sizes at different breakpoints.
 */
export const TitleAreaSizeResponsive: StoryFn = () => (
  <PageHeader>
    <PageHeader.TitleArea variant={{narrow: 'subtitle', regular: 'medium', wide: 'large'}}>
      <PageHeader.Title>Title variant: subtitle (narrow) → medium (regular) → large (wide)</PageHeader.Title>
    </PageHeader.TitleArea>
  </PageHeader>
)

TitleAreaSizeResponsive.parameters = {
  docs: {
    description: {
      story:
        'The title size changes based on viewport width: **subtitle** on narrow viewports, **medium** on regular viewports, and **large** on wide viewports.',
    },
  },
}
