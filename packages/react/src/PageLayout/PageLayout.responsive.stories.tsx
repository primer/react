import type {Meta, StoryFn} from '@storybook/react-vite'
import {Placeholder} from '../Placeholder'
import {PageLayout} from './PageLayout'

const meta: Meta = {
  title: 'Components/PageLayout/Responsive Variants',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
}

export default meta

/**
 * Test responsive divider variants on Header.
 * Resize the viewport to see different divider styles at different breakpoints.
 */
export const HeaderDividerResponsive: StoryFn = () => (
  <PageLayout>
    <PageLayout.Header divider={{narrow: 'filled', regular: 'line', wide: 'none'}}>
      <Placeholder height={64} label="Header divider: filled (narrow) → line (regular) → none (wide)" />
    </PageLayout.Header>
    <PageLayout.Content>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
  </PageLayout>
)

HeaderDividerResponsive.parameters = {
  docs: {
    description: {
      story:
        'The header divider changes based on viewport width: **filled** on narrow viewports, **line** on regular viewports, and **none** on wide viewports.',
    },
  },
}

/**
 * Test responsive hidden state on Header.
 * Resize the viewport to see the header hide/show at different breakpoints.
 */
export const HeaderHiddenResponsive: StoryFn = () => (
  <PageLayout>
    <PageLayout.Header hidden={{narrow: false, regular: false, wide: true}}>
      <Placeholder height={64} label="Header: visible (narrow + regular) → hidden (wide)" />
    </PageLayout.Header>
    <PageLayout.Content>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane>
      <Placeholder height={200} label="Pane" />
    </PageLayout.Pane>
  </PageLayout>
)

HeaderHiddenResponsive.parameters = {
  docs: {
    description: {
      story: 'The header is **visible** on narrow and regular viewports, and **hidden** on wide viewports.',
    },
  },
}

/**
 * Test responsive divider variants on Footer.
 * Resize the viewport to see different divider styles at different breakpoints.
 */
export const FooterDividerResponsive: StoryFn = () => (
  <PageLayout>
    <PageLayout.Content>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
    <PageLayout.Footer divider={{narrow: 'none', regular: 'line', wide: 'line'}}>
      <Placeholder height={64} label="Footer divider: none (narrow) → line (regular + wide)" />
    </PageLayout.Footer>
  </PageLayout>
)

FooterDividerResponsive.parameters = {
  docs: {
    description: {
      story: 'The footer divider is **none** on narrow viewports, and **line** on regular and wide viewports.',
    },
  },
}

/**
 * Test responsive hidden state on Footer.
 * Resize the viewport to see the footer hide/show at different breakpoints.
 */
export const FooterHiddenResponsive: StoryFn = () => (
  <PageLayout>
    <PageLayout.Content>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane>
      <Placeholder height={200} label="Pane" />
    </PageLayout.Pane>
    <PageLayout.Footer hidden={{narrow: false, regular: false, wide: true}}>
      <Placeholder height={64} label="Footer: visible (narrow + regular) → hidden (wide)" />
    </PageLayout.Footer>
  </PageLayout>
)

FooterHiddenResponsive.parameters = {
  docs: {
    description: {
      story: 'The footer is **visible** on narrow and regular viewports, and **hidden** on wide viewports.',
    },
  },
}

/**
 * Test responsive hidden state on Content.
 * Resize the viewport to see the content hide/show at different breakpoints.
 */
export const ContentHiddenResponsive: StoryFn = () => (
  <PageLayout>
    <PageLayout.Header>
      <Placeholder height={64} label="Header" />
    </PageLayout.Header>
    <PageLayout.Content hidden={{narrow: true, regular: false, wide: false}}>
      <Placeholder height={400} label="Content: hidden (narrow) → visible (regular + wide)" />
    </PageLayout.Content>
    <PageLayout.Pane>
      <Placeholder height={200} label="Pane" />
    </PageLayout.Pane>
  </PageLayout>
)

ContentHiddenResponsive.parameters = {
  docs: {
    description: {
      story: 'The content is **hidden** on narrow viewports, and **visible** on regular and wide viewports.',
    },
  },
}

/**
 * Test responsive position on Pane.
 * Resize the viewport to see the pane move between start and end positions.
 */
export const PanePositionResponsive: StoryFn = () => (
  <PageLayout>
    <PageLayout.Header>
      <Placeholder height={64} label="Header" />
    </PageLayout.Header>
    <PageLayout.Content>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane position={{narrow: 'end', regular: 'start', wide: 'start'}}>
      <Placeholder height={200} label="Pane position: end (narrow) → start (regular + wide)" />
    </PageLayout.Pane>
  </PageLayout>
)

PanePositionResponsive.parameters = {
  docs: {
    description: {
      story:
        'The pane position changes based on viewport width: **end** (below content) on narrow viewports, **start** (left sidebar) on regular and wide viewports.',
    },
  },
}

/**
 * Test responsive divider variants on Pane.
 * Resize the viewport to see different divider styles at different breakpoints.
 */
export const PaneDividerResponsive: StoryFn = () => (
  <PageLayout>
    <PageLayout.Content>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane divider={{narrow: 'filled', regular: 'line', wide: 'none'}}>
      <Placeholder height={200} label="Pane divider: filled (narrow) → line (regular) → none (wide)" />
    </PageLayout.Pane>
  </PageLayout>
)

PaneDividerResponsive.parameters = {
  docs: {
    description: {
      story:
        'The pane divider changes based on viewport width: **filled** on narrow viewports, **line** on regular viewports, and **none** on wide viewports.',
    },
  },
}

/**
 * Test responsive hidden state on Pane.
 * Resize the viewport to see the pane hide/show at different breakpoints.
 */
export const PaneHiddenResponsive: StoryFn = () => (
  <PageLayout>
    <PageLayout.Header>
      <Placeholder height={64} label="Header" />
    </PageLayout.Header>
    <PageLayout.Content>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane hidden={{narrow: true, regular: false, wide: false}}>
      <Placeholder height={200} label="Pane: hidden (narrow) → visible (regular + wide)" />
    </PageLayout.Pane>
  </PageLayout>
)

PaneHiddenResponsive.parameters = {
  docs: {
    description: {
      story: 'The pane is **hidden** on narrow viewports, and **visible** on regular and wide viewports.',
    },
  },
}

/**
 * Test all responsive variants together in a complex layout.
 * This story demonstrates multiple responsive properties working together.
 */
export const ComplexResponsiveLayout: StoryFn = () => (
  <PageLayout>
    <PageLayout.Header
      divider={{narrow: 'filled', regular: 'line', wide: 'none'}}
      hidden={{narrow: false, regular: false, wide: false}}
    >
      <Placeholder height={64} label="Header divider: filled (narrow) → line (regular) → none (wide)" />
    </PageLayout.Header>
    <PageLayout.Content hidden={{narrow: false, regular: false, wide: false}}>
      <Placeholder height={400} label="Content (always visible)" />
    </PageLayout.Content>
    <PageLayout.Pane
      position={{narrow: 'end', regular: 'start', wide: 'start'}}
      divider={{narrow: 'filled', regular: 'line', wide: 'line'}}
      hidden={{narrow: false, regular: false, wide: false}}
    >
      <Placeholder height={200} label="Pane: end + filled divider (narrow) → start + line divider (regular + wide)" />
    </PageLayout.Pane>
    <PageLayout.Footer divider={{narrow: 'filled', regular: 'line', wide: 'none'}}>
      <Placeholder height={64} label="Footer divider: filled (narrow) → line (regular) → none (wide)" />
    </PageLayout.Footer>
  </PageLayout>
)

ComplexResponsiveLayout.parameters = {
  docs: {
    description: {
      story:
        'A complex layout demonstrating multiple responsive properties working together. Resize the viewport to see how all the responsive variants change at different breakpoints.',
    },
  },
}

/**
 * Test responsive behavior with backward compatibility props.
 * This ensures the deprecated props still work correctly.
 */
export const BackwardCompatibilityTest: StoryFn = () => (
  <PageLayout>
    <PageLayout.Header divider="line" dividerWhenNarrow="filled">
      <Placeholder height={64} label="Header using deprecated dividerWhenNarrow prop" />
    </PageLayout.Header>
    <PageLayout.Content>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane position="start" positionWhenNarrow="end" divider="line" dividerWhenNarrow="filled">
      <Placeholder height={200} label="Pane using deprecated positionWhenNarrow and dividerWhenNarrow props" />
    </PageLayout.Pane>
    <PageLayout.Footer divider="line" dividerWhenNarrow="filled">
      <Placeholder height={64} label="Footer using deprecated dividerWhenNarrow prop" />
    </PageLayout.Footer>
  </PageLayout>
)

BackwardCompatibilityTest.parameters = {
  docs: {
    description: {
      story:
        'Tests backward compatibility with deprecated props like `dividerWhenNarrow` and `positionWhenNarrow`. These should still work correctly alongside the new responsive value format.',
    },
  },
}

/**
 * Test SSR-safe responsive behavior.
 * This story ensures no layout shift occurs during hydration.
 */
export const SSRSafeResponsive: StoryFn = () => (
  <PageLayout>
    <PageLayout.Header divider={{narrow: 'filled', regular: 'line'}}>
      <Placeholder height={64} label="Header divider: filled (narrow) → line (regular + wide)" />
    </PageLayout.Header>
    <PageLayout.Content>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane position={{narrow: 'end', regular: 'start'}} divider={{narrow: 'filled', regular: 'line'}}>
      <Placeholder height={200} label="Pane: end + filled divider (narrow) → start + line divider (regular + wide)" />
    </PageLayout.Pane>
  </PageLayout>
)

SSRSafeResponsive.parameters = {
  docs: {
    description: {
      story:
        'Demonstrates SSR-safe responsive behavior. The header divider is **filled** on narrow viewports and **line** on regular and wide viewports. The pane is positioned at **end** with a **filled** divider on narrow viewports, and at **start** with a **line** divider on regular and wide viewports. All responsive values are handled through CSS data attributes and media queries, preventing layout shift during hydration. This follows ADR-018 for responsive values.',
    },
  },
}
