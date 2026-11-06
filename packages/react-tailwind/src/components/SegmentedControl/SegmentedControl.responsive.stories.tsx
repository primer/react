import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {SegmentedControl} from './SegmentedControl'

const meta = {
  title: 'React Tailwind/Forms/SegmentedControl/Responsive Tests',
  component: SegmentedControl,
  parameters: {layout: 'padded', controls: {expanded: true}},
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

const segments = (
  <>
    <SegmentedControl.Button value="preview" leadingVisual={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button value="raw" leadingVisual={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button value="blame" leadingVisual={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </>
)

/** Resize the viewport to see the control change width at different breakpoints. */
export const FullWidthResponsive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The control fills the full width on **narrow** viewports and uses inline width on **regular** and **wide** viewports.',
      },
    },
  },
  render: () => (
    <div>
      <p style={{marginBottom: '16px'}}>Full width: yes (narrow) → no (regular + wide)</p>
      <SegmentedControl
        aria-label="File view"
        defaultValue={['preview']}
        fullWidth={{narrow: true, regular: false, wide: false}}
      >
        {segments}
      </SegmentedControl>
    </div>
  ),
}

/** Resize the viewport to see labels hide and show at different breakpoints. */
export const VariantHideLabelsResponsive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Labels are **hidden** (icon-only) on narrow viewports and **visible** on regular and wide viewports. Note: leadingVisual prop is required for hideLabels variant.',
      },
    },
  },
  render: () => (
    <div>
      <p style={{marginBottom: '16px'}}>Labels: hidden (narrow) → visible (regular + wide)</p>
      <SegmentedControl
        aria-label="File view"
        defaultValue={['preview']}
        variant={{narrow: 'hideLabels', regular: 'default', wide: 'default'}}
      >
        {segments}
      </SegmentedControl>
    </div>
  ),
}

/** Resize the viewport to see the control switch between a dropdown and buttons. */
export const VariantDropdownResponsive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Renders as a **dropdown menu** on narrow viewports and as **segmented buttons** on regular and wide viewports.',
      },
    },
  },
  render: () => (
    <div>
      <p style={{marginBottom: '16px'}}>Variant: dropdown (narrow) → buttons (regular + wide)</p>
      <SegmentedControl
        aria-label="File view"
        defaultValue={['preview']}
        variant={{narrow: 'dropdown', regular: 'default', wide: 'default'}}
      >
        {segments}
      </SegmentedControl>
    </div>
  ),
}

/** Only the narrow breakpoint is specified. */
export const VariantDropdownNarrowOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Only the **narrow** breakpoint sets the dropdown variant; wider breakpoints fall back to the default segmented buttons.',
      },
    },
  },
  render: () => (
    <div>
      <p style={{marginBottom: '16px'}}>Variant: dropdown (narrow) → buttons (others inherit default)</p>
      <SegmentedControl aria-label="File view" defaultValue={['preview']} variant={{narrow: 'dropdown'}}>
        {segments}
      </SegmentedControl>
    </div>
  ),
}

/** Combines responsive full width and variant. */
export const ComplexResponsive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Complex: **full-width + icon-only** (narrow) → **full-width + labels** (regular) → **inline + labels** (wide)',
      },
    },
  },
  render: () => (
    <div>
      <p style={{marginBottom: '16px'}}>
        Complex: full-width + icon-only (narrow) → full-width + labels (regular) → inline + labels (wide)
      </p>
      <SegmentedControl
        aria-label="File view"
        defaultValue={['preview']}
        fullWidth={{narrow: true, regular: true, wide: false}}
        variant={{narrow: 'hideLabels', regular: 'default', wide: 'default'}}
      >
        {segments}
      </SegmentedControl>
    </div>
  ),
}
