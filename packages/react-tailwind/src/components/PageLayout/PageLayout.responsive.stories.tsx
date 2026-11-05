import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageLayout} from './PageLayout'
import {Placeholder} from './PageLayout.storyHelpers'

const meta = {
  title: 'React Tailwind/Layout/PageLayout/Responsive Variants',
  component: PageLayout,
  parameters: {layout: 'fullscreen', controls: {expanded: true}},
} satisfies Meta<typeof PageLayout>

export default meta
type Story = StoryObj<typeof meta>

const describe = (story: string) => ({docs: {description: {story}}})

export const HeaderDividerResponsive: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Header divider={{narrow: 'filled', regular: 'line', wide: 'none'}}>
        <Placeholder height={64} label="Header divider: filled (narrow) → line (regular) → none (wide)" />
      </PageLayout.Header>
      <PageLayout.Content>
        <Placeholder height={400} label="Content" />
      </PageLayout.Content>
    </PageLayout>
  ),
  parameters: describe(
    'The header divider changes based on viewport width: **filled** on narrow viewports, **line** on regular viewports, and **none** on wide viewports.',
  ),
}

export const HeaderHiddenResponsive: Story = {
  render: () => (
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
  ),
  parameters: describe('The header is **visible** on narrow and regular viewports, and **hidden** on wide viewports.'),
}

export const FooterDividerResponsive: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Content>
        <Placeholder height={400} label="Content" />
      </PageLayout.Content>
      <PageLayout.Footer divider={{narrow: 'none', regular: 'line', wide: 'line'}}>
        <Placeholder height={64} label="Footer divider: none (narrow) → line (regular + wide)" />
      </PageLayout.Footer>
    </PageLayout>
  ),
  parameters: describe(
    'The footer divider is **none** on narrow viewports, and **line** on regular and wide viewports.',
  ),
}

export const FooterHiddenResponsive: Story = {
  render: () => (
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
  ),
  parameters: describe('The footer is **visible** on narrow and regular viewports, and **hidden** on wide viewports.'),
}

export const ContentHiddenResponsive: Story = {
  render: () => (
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
  ),
  parameters: describe('The content is **hidden** on narrow viewports, and **visible** on regular and wide viewports.'),
}

export const PanePositionResponsive: Story = {
  render: () => (
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
  ),
  parameters: describe(
    'The pane position changes based on viewport width: **end** (below content) on narrow viewports, **start** (left sidebar) on regular and wide viewports.',
  ),
}

export const PaneDividerResponsive: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Content>
        <Placeholder height={400} label="Content" />
      </PageLayout.Content>
      <PageLayout.Pane divider={{narrow: 'filled', regular: 'line', wide: 'none'}}>
        <Placeholder height={200} label="Pane divider: filled (narrow) → line (regular) → none (wide)" />
      </PageLayout.Pane>
    </PageLayout>
  ),
  parameters: describe(
    'The pane divider changes based on viewport width: **filled** on narrow viewports, **line** on regular viewports, and **none** on wide viewports.',
  ),
}

export const PaneHiddenResponsive: Story = {
  render: () => (
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
  ),
  parameters: describe('The pane is **hidden** on narrow viewports, and **visible** on regular and wide viewports.'),
}

export const ComplexResponsiveLayout: Story = {
  render: () => (
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
  ),
  parameters: describe(
    'A complex layout demonstrating multiple responsive properties working together. Resize the viewport to see how all the responsive variants change at different breakpoints.',
  ),
}

/**
 * Upstream's deprecated `dividerWhenNarrow` and `positionWhenNarrow` props are not ported; this story shows their
 * responsive-value replacements so it can be compared with upstream's backward compatibility story.
 */
export const BackwardCompatibilityTest: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Header divider={{narrow: 'filled', regular: 'line'}}>
        <Placeholder height={64} label="Header using a responsive divider instead of dividerWhenNarrow" />
      </PageLayout.Header>
      <PageLayout.Content>
        <Placeholder height={400} label="Content" />
      </PageLayout.Content>
      <PageLayout.Pane position={{narrow: 'end', regular: 'start'}} divider={{narrow: 'filled', regular: 'line'}}>
        <Placeholder
          height={200}
          label="Pane using responsive position and divider instead of positionWhenNarrow and dividerWhenNarrow"
        />
      </PageLayout.Pane>
      <PageLayout.Footer divider={{narrow: 'filled', regular: 'line'}}>
        <Placeholder height={64} label="Footer using a responsive divider instead of dividerWhenNarrow" />
      </PageLayout.Footer>
    </PageLayout>
  ),
  parameters: describe(
    'Upstream deprecated `dividerWhenNarrow` and `positionWhenNarrow` in favor of responsive values. This package only supports the responsive value format, shown here with the equivalent layout.',
  ),
}

export const SSRSafeResponsive: Story = {
  render: () => (
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
  ),
  parameters: describe(
    'Demonstrates SSR-safe responsive behavior. The header divider is **filled** on narrow viewports and **line** on regular and wide viewports. The pane is positioned at **end** with a **filled** divider on narrow viewports, and at **start** with a **line** divider on regular and wide viewports. All responsive values are handled through CSS media queries, preventing layout shift during hydration.',
  ),
}

/**
 * Regression test for a whitespace gap above the pane when PageLayout has a forced height on narrow viewports.
 * Narrow layouts stack as a column, so extra height is absorbed by the content instead of appearing between rows.
 */
export const FixedHeightResponsive: Story = {
  render: () => (
    <div className="flex h-screen flex-col">
      <PageLayout containerWidth="full" columnGap="none" padding="none" className="h-full">
        <PageLayout.Pane position="start">
          <Placeholder height={300} label="Pane" />
        </PageLayout.Pane>
        <PageLayout.Content width="full" padding="none">
          <Placeholder height={300} label="Content" />
        </PageLayout.Content>
      </PageLayout>
    </div>
  ),
  parameters: {viewport: {defaultViewport: 'mobile1'}},
}
