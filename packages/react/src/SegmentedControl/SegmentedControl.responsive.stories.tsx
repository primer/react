import type {Meta, StoryFn} from '@storybook/react-vite'
import React from 'react'
import {SegmentedControl} from './SegmentedControl'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'

const meta: Meta = {
  title: 'Components/SegmentedControl/Responsive Tests',
  parameters: {
    layout: 'padded',
    controls: {expanded: true},
  },
}

export default meta

/**
 * Test responsive fullWidth behavior.
 * Resize the viewport to see the control change width at different breakpoints.
 */
export const FullWidthResponsive: StoryFn = () => (
  <SegmentedControl aria-label="File view" fullWidth={{narrow: true, regular: false, wide: false}}>
    <SegmentedControl.Button defaultSelected leadingVisual={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={FileCodeIcon}>Raw</SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={PeopleIcon}>Blame</SegmentedControl.Button>
  </SegmentedControl>
)

FullWidthResponsive.parameters = {
  docs: {
    description: {
      story:
        'The control fills the full width on **narrow** viewports and uses inline width on **regular** and **wide** viewports.',
    },
  },
}

/**
 * Test responsive variant behavior with hideLabels.
 * Resize the viewport to see labels hide/show at different breakpoints.
 */
export const VariantHideLabelsResponsive: StoryFn = () => (
  <SegmentedControl aria-label="File view" variant={{narrow: 'hideLabels', regular: 'default', wide: 'default'}}>
    <SegmentedControl.Button defaultSelected leadingVisual={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={FileCodeIcon}>Raw</SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={PeopleIcon}>Blame</SegmentedControl.Button>
  </SegmentedControl>
)

VariantHideLabelsResponsive.parameters = {
  docs: {
    description: {
      story:
        'Labels are **hidden** (icon-only) on narrow viewports and **visible** on regular and wide viewports. Note: leadingVisual prop is required for hideLabels variant.',
    },
  },
}

/**
 * Test responsive variant behavior with dropdown.
 * Resize the viewport to see the control switch between dropdown and buttons.
 */
export const VariantDropdownResponsive: StoryFn = () => (
  <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown', regular: 'default', wide: 'default'}}>
    <SegmentedControl.Button defaultSelected leadingVisual={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={FileCodeIcon}>Raw</SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={PeopleIcon}>Blame</SegmentedControl.Button>
  </SegmentedControl>
)

VariantDropdownResponsive.parameters = {
  docs: {
    description: {
      story:
        'Renders as a **dropdown menu** on narrow viewports and as **segmented buttons** on regular and wide viewports.',
    },
  },
}

/**
 * Test complex responsive behavior combining fullWidth and variant.
 */
export const ComplexResponsive: StoryFn = () => (
  <SegmentedControl
    aria-label="File view"
    fullWidth={{narrow: true, regular: true, wide: false}}
    variant={{narrow: 'hideLabels', regular: 'default', wide: 'default'}}
  >
    <SegmentedControl.Button defaultSelected leadingVisual={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={FileCodeIcon}>Raw</SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={PeopleIcon}>Blame</SegmentedControl.Button>
  </SegmentedControl>
)

ComplexResponsive.parameters = {
  docs: {
    description: {
      story:
        'Complex: **full-width + icon-only** (narrow) → **full-width + labels** (regular) → **inline + labels** (wide)',
    },
  },
}
