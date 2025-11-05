import type {Meta, StoryFn} from '@storybook/react-vite'
import type React from 'react'
import {Hidden} from './Hidden'

const meta: Meta = {
  title: 'Experimental/Components/Hidden/Responsive Tests',
  parameters: {
    layout: 'padded',
    controls: {expanded: true},
  },
}

export default meta

const Box = ({children}: {children: React.ReactNode}) => (
  <div
    style={{
      padding: '16px',
      backgroundColor: '#0969da',
      color: 'white',
      borderRadius: '6px',
      marginBottom: '8px',
    }}
  >
    {children}
  </div>
)

/**
 * Test hiding content on narrow viewports only.
 * Resize the viewport to see the content hide on narrow and show on regular/wide.
 */
export const HiddenOnNarrow: StoryFn = () => (
  <>
    <p>This box is hidden on narrow viewports, visible on regular and wide:</p>
    <Hidden when="narrow">
      <Box>Hidden on narrow ({'<'}768px) → Visible on regular and wide (≥768px)</Box>
    </Hidden>
  </>
)

HiddenOnNarrow.parameters = {
  docs: {
    description: {
      story: 'Content is **hidden** on narrow viewports and **visible** on regular and wide viewports.',
    },
  },
}

/**
 * Test hiding content on regular viewports only.
 * Resize the viewport to see the content show/hide at different breakpoints.
 */
export const HiddenOnRegular: StoryFn = () => (
  <>
    <p>This box is hidden on regular viewports, visible on narrow and wide:</p>
    <Hidden when="regular">
      <Box>Visible on narrow ({'<'}768px) → Hidden on regular (768-1399px) → Visible on wide (≥1400px)</Box>
    </Hidden>
  </>
)

HiddenOnRegular.parameters = {
  docs: {
    description: {
      story: 'Content is **visible** on narrow and wide viewports, **hidden** on regular viewports.',
    },
  },
}

/**
 * Test hiding content on wide viewports only.
 * Resize the viewport to see the content hide on wide and show on narrow/regular.
 */
export const HiddenOnWide: StoryFn = () => (
  <>
    <p>This box is hidden on wide viewports, visible on narrow and regular:</p>
    <Hidden when="wide">
      <Box>Visible on narrow and regular ({'<'}1400px) → Hidden on wide (≥1400px)</Box>
    </Hidden>
  </>
)

HiddenOnWide.parameters = {
  docs: {
    description: {
      story: 'Content is **visible** on narrow and regular viewports, **hidden** on wide viewports.',
    },
  },
}

/**
 * Test hiding content on multiple viewports (narrow and wide).
 * Only visible on regular viewports.
 */
export const HiddenOnNarrowAndWide: StoryFn = () => (
  <>
    <p>This box is only visible on regular viewports:</p>
    <Hidden when={['narrow', 'wide']}>
      <Box>Hidden on narrow ({'<'}768px) → Visible on regular (768-1399px) → Hidden on wide (≥1400px)</Box>
    </Hidden>
  </>
)

HiddenOnNarrowAndWide.parameters = {
  docs: {
    description: {
      story: 'Content is **hidden** on narrow and wide viewports, only **visible** on regular viewports.',
    },
  },
}

/**
 * Test hiding content on multiple viewports (regular and wide).
 * Only visible on narrow viewports.
 */
export const HiddenOnRegularAndWide: StoryFn = () => (
  <>
    <p>This box is only visible on narrow viewports:</p>
    <Hidden when={['regular', 'wide']}>
      <Box>Visible on narrow ({'<'}768px) → Hidden on regular and wide (≥768px)</Box>
    </Hidden>
  </>
)

HiddenOnRegularAndWide.parameters = {
  docs: {
    description: {
      story: 'Content is **visible** on narrow viewports, **hidden** on regular and wide viewports.',
    },
  },
}
