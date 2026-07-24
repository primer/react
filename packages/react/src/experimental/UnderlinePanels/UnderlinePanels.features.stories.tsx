import type {Meta} from '@storybook/react-vite'
import {action} from 'storybook/actions'
import {useState} from 'react'
import {INITIAL_VIEWPORTS} from 'storybook/viewport'
import UnderlinePanels from './UnderlinePanels'
import {AnchoredOverlay} from '../../AnchoredOverlay'
import {Button} from '../../Button'
import type {ComponentProps} from '../../utils/types'
import {
  CodeIcon,
  CommentDiscussionIcon,
  EyeIcon,
  GearIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  GraphIcon,
  PlayIcon,
  ProjectIcon,
  ShieldLockIcon,
  TagIcon,
} from '@primer/octicons-react'

export default {
  title: 'Experimental/Components/UnderlinePanels/Features',
  component: UnderlinePanels,
} as Meta<ComponentProps<typeof UnderlinePanels>>

export const SelectedTab = () => (
  <UnderlinePanels aria-label="Select a tab" id="tab-panels">
    <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
    <UnderlinePanels.Tab aria-selected={true}>Tab 2</UnderlinePanels.Tab>
    <UnderlinePanels.Tab>Tab 3</UnderlinePanels.Tab>
    <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
  </UnderlinePanels>
)

export const LabelledByExternalElement = () => (
  <>
    <h2 id="my-heading">UnderlinePanels example</h2>
    <UnderlinePanels aria-labelledby="my-heading">
      <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
      <UnderlinePanels.Tab>Tab 2</UnderlinePanels.Tab>
      <UnderlinePanels.Tab>Tab 3</UnderlinePanels.Tab>
      <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
      <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
    </UnderlinePanels>
  </>
)

export const WithIcons = () => (
  <UnderlinePanels aria-label="Tabs with icons">
    <UnderlinePanels.Tab icon={CodeIcon}>Tab 1</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={EyeIcon}>Tab 2</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={GitPullRequestIcon}>Tab 3</UnderlinePanels.Tab>
    <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
  </UnderlinePanels>
)

export const WithIconsHiddenOnNarrowScreen = () => (
  <UnderlinePanels aria-label="Tabs with icons">
    <UnderlinePanels.Tab icon={CodeIcon}>Tab 1</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={EyeIcon}>Tab 2</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={GitPullRequestIcon}>Tab 3</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={CommentDiscussionIcon}>Tab 4</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={PlayIcon}>Tab 5</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={ProjectIcon}>Tab 6</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={GraphIcon}>Tab 7</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={GearIcon}>Tab 8</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={ShieldLockIcon}>Tab 9</UnderlinePanels.Tab>
    <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 4</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 5</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 6</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 7</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 8</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 9</UnderlinePanels.Panel>
  </UnderlinePanels>
)

WithIconsHiddenOnNarrowScreen.parameters = {
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      narrowScreen: {
        name: 'Narrow Screen',
        styles: {
          width: '800px',
          height: '100%',
        },
      },
    },
    defaultViewport: 'narrowScreen',
  },
}

export const WithCounters = () => {
  return (
    <UnderlinePanels aria-label="Tabs with counters">
      <UnderlinePanels.Tab counter="11K">Tab 1</UnderlinePanels.Tab>
      <UnderlinePanels.Tab counter={12}>Tab 2</UnderlinePanels.Tab>
      <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    </UnderlinePanels>
  )
}

export const WithCountersInLoadingState = () => {
  return (
    <UnderlinePanels aria-label="Tabs with counters" loadingCounters>
      <UnderlinePanels.Tab counter="11K">Tab 1</UnderlinePanels.Tab>
      <UnderlinePanels.Tab counter={12}>Tab 2</UnderlinePanels.Tab>
      <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    </UnderlinePanels>
  )
}

export const Controlled = () => {
  const [refType, setRefType] = useState('branch')

  return (
    <>
      <UnderlinePanels
        aria-label="Ref type"
        value={refType}
        onChange={({value}) => {
          action('onChange')({value})
          setRefType(value)
        }}
      >
        <UnderlinePanels.Tab value="branch" icon={GitBranchIcon}>
          Branches
        </UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="tag" icon={TagIcon}>
          Tags
        </UnderlinePanels.Tab>
        <UnderlinePanels.Panel value="branch">Find or create a branch…</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="tag">Search or create a new tag…</UnderlinePanels.Panel>
      </UnderlinePanels>
      <p>
        Selected ref type: <strong>{refType}</strong>
      </p>
    </>
  )
}

export const Uncontrolled = () => (
  <UnderlinePanels
    aria-label="Ref type"
    defaultValue="tag"
    onChange={({value}) => {
      action('onChange')({value})
    }}
  >
    <UnderlinePanels.Tab value="branch">Branches</UnderlinePanels.Tab>
    <UnderlinePanels.Tab value="tag">Tags</UnderlinePanels.Tab>
    <UnderlinePanels.Panel value="branch">Find or create a branch…</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tag">Search or create a new tag…</UnderlinePanels.Panel>
  </UnderlinePanels>
)

export const ManualActivation = () => {
  const [refType, setRefType] = useState('branch')

  return (
    <>
      <p>
        With <code>activationMode=&quot;manual&quot;</code>, arrow keys only move focus; press Enter or Space (or click)
        to commit selection. Prefer this when switching tabs triggers async work like a fetch.
      </p>
      <UnderlinePanels
        aria-label="Ref type"
        value={refType}
        activationMode="manual"
        onChange={({value}) => {
          action('onChange')({value})
          setRefType(value)
        }}
      >
        <UnderlinePanels.Tab value="branch">Branches</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="tag">Tags</UnderlinePanels.Tab>
        <UnderlinePanels.Panel value="branch">Find or create a branch…</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="tag">Search or create a new tag…</UnderlinePanels.Panel>
      </UnderlinePanels>
    </>
  )
}

// When `UnderlinePanels` lives inside an `AnchoredOverlay` (or any container with its own
// `FocusZone`), disable the overlay's focus zone so the two don't both manage `tabindex`. The
// tablist already implements its own roving tabindex (a single tab stop with internal Arrow
// navigation); a competing focus zone can leave every tab at `tabindex="-1"` and trap keyboard
// users. Disabling it via `focusZoneSettings={{disabled: true}}` lets the tablist own keyboard
// navigation for the tabs.
export const InOverlay = () => {
  const [open, setOpen] = useState(false)
  const [refType, setRefType] = useState('branch')

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Select ref type</Button>}
      overlayProps={{role: 'dialog', 'aria-modal': true, 'aria-label': 'Select a ref type', style: {width: '320px'}}}
      focusZoneSettings={{disabled: true}}
    >
      <UnderlinePanels
        aria-label="Ref type"
        value={refType}
        onChange={({value}) => {
          action('onChange')({value})
          setRefType(value)
        }}
      >
        <UnderlinePanels.Tab value="branch">Branches</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="tag">Tags</UnderlinePanels.Tab>
        <UnderlinePanels.Panel value="branch">Find or create a branch…</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="tag">Search or create a new tag…</UnderlinePanels.Panel>
      </UnderlinePanels>
    </AnchoredOverlay>
  )
}
