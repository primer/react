import type {Meta, StoryObj} from '@storybook/react-vite'
import {FeatureFlags} from '../FeatureFlags'
import {PlatformSelectPanel} from './platform/PlatformSelectPanel'

interface PlatformStoryArgs {
  nativeDialog: boolean
  invokers: boolean
}

const meta = {
  title: 'Components/SelectPanel/Platform',
  args: {
    nativeDialog: false,
    invokers: false,
  },
  argTypes: {
    nativeDialog: {
      control: 'boolean',
      description: 'Opt into the internal primer_react_select_panel_native_dialog adapter for composable parts.',
    },
    invokers: {
      control: 'boolean',
      description: 'Opt into primer_react_select_panel_native_invokers when the native dialog is enabled.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Web platform proofs of concept. Native dialog and invoker adapters are internal implementations of the composable parts, enabled by default-off feature flags. These stories use local Controls to override the global toolbar flags. Toggle the controls to compare with the existing overlay; unsupported browser features display an explicit fallback notice.',
      },
    },
  },
} satisfies Meta<PlatformStoryArgs>

export default meta
type Story = StoryObj<PlatformStoryArgs>

export const Popover: Story = {
  parameters: {
    controls: {exclude: ['nativeDialog', 'invokers']},
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
        primer_react_select_panel_native_invokers: false,
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
    controls: {exclude: ['invokers']},
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
        primer_react_select_panel_native_invokers: false,
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

export const Invokers: Story = {
  args: {nativeDialog: true, invokers: true},
  parameters: {
    docs: {
      description: {
        story:
          'Opt-in native command/commandfor buttons target a persistently mounted dialog. The browser performs show-modal and close; the adapter synchronizes those commands with SelectPanel state. Disable invokers to retain the native dialog with JavaScript activation, or disable nativeDialog to return to the existing overlay.',
      },
    },
  },
  render: ({nativeDialog, invokers}) => (
    <FeatureFlags
      flags={{
        primer_react_select_panel_native_dialog: nativeDialog,
        primer_react_select_panel_native_invokers: invokers,
      }}
    >
      <p>
        Native <code>command=&quot;show-modal&quot;</code> and <code>command=&quot;close&quot;</code> buttons target the
        dialog using <code>commandfor</code>. Toggle <strong>invokers</strong> in Controls to compare activation paths.
      </p>
      <PlatformSelectPanel />
    </FeatureFlags>
  ),
}
