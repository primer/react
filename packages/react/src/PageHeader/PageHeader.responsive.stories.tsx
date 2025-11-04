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

/**
 * Test SSR-safe responsive behavior.
 * This story ensures no layout shift occurs during hydration.
 */
export const SSRSafeResponsive: StoryFn = () => (
  <PageHeader>
    <PageHeader.TitleArea variant={{narrow: 'subtitle', regular: 'medium'}}>
      <PageHeader.Title>
        SSR-safe: subtitle (narrow) → medium (regular + wide) - No layout shift during hydration
      </PageHeader.Title>
    </PageHeader.TitleArea>
  </PageHeader>
)

SSRSafeResponsive.parameters = {
  docs: {
    description: {
      story:
        'Demonstrates SSR-safe responsive behavior. The title variant is **subtitle** on narrow viewports and **medium** on regular and wide viewports. All responsive values are handled through CSS data attributes and media queries, preventing layout shift during hydration. This follows ADR-018 for responsive values.',
    },
  },
}
