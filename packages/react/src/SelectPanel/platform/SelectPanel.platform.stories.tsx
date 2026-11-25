import {useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, waitFor} from 'storybook/test'
import {Button} from '../../Button'
import {FeatureFlags} from '../../FeatureFlags'
import {SelectPanel} from '../SelectPanel'
import {nativeSelectPanelCapabilities} from './NativeSelectPanelContext'
import {PlatformSelectPanel} from './PlatformSelectPanel'

interface PlatformStoryArgs {
  nativeDialog: boolean
}

const meta = {
  title: 'Components/SelectPanel/Platform',
  args: {
    nativeDialog: false,
  },
  argTypes: {
    nativeDialog: {
      control: 'boolean',
      description: 'Opt into the internal primer_react_select_panel_native_dialog adapter for composable parts.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Web platform proofs of concept. Native hosting is an internal implementation of the composable parts, enabled by a default-off feature flag. These stories use local Controls to override the global toolbar flags. Toggle the controls to compare with the existing overlay; unsupported browser features display an explicit fallback notice.',
      },
    },
  },
} satisfies Meta<PlatformStoryArgs>

export default meta
type Story = StoryObj<PlatformStoryArgs>

export const Popover: Story = {
  parameters: {
    controls: {exclude: ['nativeDialog']},
    docs: {
      description: {
        story:
          'Uses SelectPanel.Overlay renderAs="popover" with the CSS anchor positioning flag enabled. The story-only fixture sets overlayProps._PrivateDisablePortal only when the native popover is active. The picker remains inline in the DOM and renders in the browser top layer without an overlay portal; the shared backdrop still uses a portal. React still owns visibility, focus trapping, and dismissal. Unsupported and narrow fullscreen presentations retain the portal fallback.',
      },
      source: {
        // eslint-disable-next-line github/unescaped-html-literal -- Storybook displays this JSX as code, not HTML.
        code: `<FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
  <PlatformSelectPanel renderAs="popover" />
</FeatureFlags>`,
      },
    },
  },
  render: () => (
    <FeatureFlags
      flags={{
        primer_react_css_anchor_positioning: true,
        primer_react_select_panel_native_dialog: false,
      }}
    >
      <p>
        <code>renderAs=&quot;popover&quot;</code> opts into a manual, top-layer popover when native CSS anchor
        positioning is available, without portaling the picker content.
      </p>
      <PlatformSelectPanel renderAs="popover" />
    </FeatureFlags>
  ),
}

export const NativeDialog: Story = {
  args: {nativeDialog: true},
  parameters: {
    docs: {
      description: {
        story:
          'Opt-in native <dialog> adapter. showModal() supplies focus containment, top-layer rendering, and an inert background. Disable nativeDialog in Controls to compare with the existing SelectPanel overlay. The same default-off flag works in ordinary composition stories.',
      },
    },
  },
  render: ({nativeDialog}) => (
    <FeatureFlags
      flags={{
        primer_react_select_panel_native_dialog: nativeDialog,
      }}
    >
      <p>
        An internal <code>&lt;dialog&gt;</code> host reuses the same SelectPanel search, list, items, and selection
        state. Toggle <strong>nativeDialog</strong> in Controls to compare implementations.
      </p>
      <PlatformSelectPanel />
    </FeatureFlags>
  ),
}

function NativeAnchoredPicker() {
  const [filter, setFilter] = useState('')
  return (
    <SelectPanel.Root filterValue={filter} onFilterChange={setFilter}>
      <SelectPanel.Trigger>Choose labels</SelectPanel.Trigger>
      <SelectPanel.Overlay variant={{regular: 'anchored', narrow: 'anchored'}}>
        <SelectPanel.Content>
          <SelectPanel.Header>
            <SelectPanel.Title>Native labels</SelectPanel.Title>
            <SelectPanel.CloseButton />
          </SelectPanel.Header>
          <SelectPanel.SearchInput aria-label="Filter native labels" />
          <SelectPanel.List aria-label="Native label choices">
            {['Bug', 'Enhancement', 'Accessibility']
              .filter(label => label.toLowerCase().includes(filter.toLowerCase()))
              .map(label => (
                <SelectPanel.Item key={label} value={label}>
                  {label}
                </SelectPanel.Item>
              ))}
          </SelectPanel.List>
        </SelectPanel.Content>
      </SelectPanel.Overlay>
    </SelectPanel.Root>
  )
}

export const NativeAnchored: Story = {
  args: {nativeDialog: true},
  parameters: {
    docs: {
      description: {
        story:
          'Anchored native panels use a manual top-layer popover with dialog semantics, without making the page inert or locking background scrolling. Tab can leave the panel, Escape dismisses it, and clicking a background control preserves its focus. JavaScript controls opening and dismissal. Turning nativeDialog off retains the compatibility implementation.',
      },
    },
  },
  render: ({nativeDialog}) => (
    <FeatureFlags
      flags={{
        primer_react_select_panel_native_dialog: nativeDialog,
      }}
    >
      <div style={{minHeight: '140vh'}}>
        <Button>Background action</Button>
        <p>Open the picker, then scroll the page, Tab outside it, or activate the background action.</p>
        <NativeAnchoredPicker />
      </div>
    </FeatureFlags>
  ),
  play: async ({canvas, userEvent, args}) => {
    if (!args.nativeDialog || nativeSelectPanelCapabilities() === 'unsupported') return
    const trigger = canvas.getByRole('button', {name: 'Choose labels'})
    await userEvent.click(trigger)
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'))
    const dialog = canvas.getByRole('dialog', {name: 'Native labels'})
    await expect(dialog).not.toHaveAttribute('aria-modal')
    const background = canvas.getByRole('button', {name: 'Background action'})
    await userEvent.click(background)
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await expect(background).toHaveFocus()
  },
}
