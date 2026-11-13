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
import type {Meta, StoryObj} from '@storybook/react-vite'
import React from 'react'
import {action} from 'storybook/actions'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {Button} from '../Button'
import {UnderlinePanels} from './UnderlinePanels'

const meta = {title: 'React Tailwind/Navigation/UnderlinePanels/Features', component: UnderlinePanels} satisfies Meta<
  typeof UnderlinePanels
>
export default meta
type Story = StoryObj<typeof meta>

export const CustomListWrapper: StoryObj<{wrapperInset: 'none' | 'primer' | 'legacy'}> = {
  args: {wrapperInset: 'none'},
  argTypes: {wrapperInset: {control: 'select', options: ['none', 'primer', 'legacy']}},
  render: ({wrapperInset}) => (
    <UnderlinePanels defaultValue="overview">
      <UnderlinePanels.List
        aria-label="Alert details"
        className="gap-4"
        wrapperClassName={
          {
            none: 'px-0 pt-0 shadow-none',
            primer: 'px-[16px] pt-0 shadow-none',
            legacy: 'px-[24px] pt-0 shadow-none',
          }[wrapperInset]
        }
      >
        <UnderlinePanels.Tab value="overview">Overview</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="activity">Activity</UnderlinePanels.Tab>
      </UnderlinePanels.List>
      <UnderlinePanels.Panel value="overview">Alert overview</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="activity">Alert activity</UnderlinePanels.Panel>
    </UnderlinePanels>
  ),
}

export const SelectedTab: Story = {
  render: () => (
    <UnderlinePanels defaultValue="two">
      <UnderlinePanels.List aria-label="Select a tab">
        <UnderlinePanels.Tab value="one">Tab 1</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="two">Tab 2</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="three">Tab 3</UnderlinePanels.Tab>
      </UnderlinePanels.List>
      <UnderlinePanels.Panel value="one">Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="two">Panel 2</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="three">Panel 3</UnderlinePanels.Panel>
    </UnderlinePanels>
  ),
}
export const LabelledByExternalElement: Story = {
  render: () => (
    <>
      <h2 id="panel-heading">UnderlinePanels example</h2>
      <UnderlinePanels defaultValue="one">
        <UnderlinePanels.List aria-labelledby="panel-heading">
          <UnderlinePanels.Tab value="one">Tab 1</UnderlinePanels.Tab>
          <UnderlinePanels.Tab value="two">Tab 2</UnderlinePanels.Tab>
          <UnderlinePanels.Tab value="three">Tab 3</UnderlinePanels.Tab>
        </UnderlinePanels.List>
        <UnderlinePanels.Panel value="one">Panel 1</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="two">Panel 2</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="three">Panel 3</UnderlinePanels.Panel>
      </UnderlinePanels>
    </>
  ),
}
export const WithIcons: Story = {
  render: () => (
    <UnderlinePanels defaultValue="one">
      <UnderlinePanels.List aria-label="Tabs with icons">
        <UnderlinePanels.Tab value="one" icon={CodeIcon}>
          Tab 1
        </UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="two" icon={EyeIcon}>
          Tab 2
        </UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="three" icon={GitPullRequestIcon}>
          Tab 3
        </UnderlinePanels.Tab>
      </UnderlinePanels.List>
      <UnderlinePanels.Panel value="one">Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="two">Panel 2</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="three">Panel 3</UnderlinePanels.Panel>
    </UnderlinePanels>
  ),
}
export const WithIconsHiddenOnNarrowScreen: Story = {
  render: () => {
    const tabs = [
      ['one', 'Tab 1', CodeIcon],
      ['two', 'Tab 2', EyeIcon],
      ['three', 'Tab 3', GitPullRequestIcon],
      ['four', 'Tab 4', CommentDiscussionIcon],
      ['five', 'Tab 5', PlayIcon],
      ['six', 'Tab 6', ProjectIcon],
      ['seven', 'Tab 7', GraphIcon],
      ['eight', 'Tab 8', GearIcon],
      ['nine', 'Tab 9', ShieldLockIcon],
    ] as const
    return (
      <UnderlinePanels defaultValue="one">
        <UnderlinePanels.List aria-label="Tabs with icons">
          {tabs.map(([value, label, icon]) => (
            <UnderlinePanels.Tab key={value} value={value} icon={icon}>
              {label}
            </UnderlinePanels.Tab>
          ))}
        </UnderlinePanels.List>
        {tabs.map(([value], index) => (
          <UnderlinePanels.Panel key={value} value={value}>
            Panel {index + 1}
          </UnderlinePanels.Panel>
        ))}
      </UnderlinePanels>
    )
  },
}
export const WithCounters: Story = {
  render: () => (
    <UnderlinePanels defaultValue="one">
      <UnderlinePanels.List aria-label="Tabs with counters">
        <UnderlinePanels.Tab value="one" counter="11K">
          Tab 1
        </UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="two" counter={12}>
          Tab 2
        </UnderlinePanels.Tab>
      </UnderlinePanels.List>
      <UnderlinePanels.Panel value="one">Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="two">Panel 2</UnderlinePanels.Panel>
    </UnderlinePanels>
  ),
}
export const WithCountersInLoadingState: Story = {
  render: () => (
    <UnderlinePanels defaultValue="one" loadingCounters>
      <UnderlinePanels.List aria-label="Tabs with counters">
        <UnderlinePanels.Tab value="one" counter="11K">
          Tab 1
        </UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="two" counter={12}>
          Tab 2
        </UnderlinePanels.Tab>
      </UnderlinePanels.List>
      <UnderlinePanels.Panel value="one">Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="two">Panel 2</UnderlinePanels.Panel>
    </UnderlinePanels>
  ),
}

const RefTypePanels = () => (
  <>
    <UnderlinePanels.Panel value="branch">Find or create a branch…</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tag">Search or create a new tag…</UnderlinePanels.Panel>
  </>
)

export const Controlled: Story = {
  render: function Controlled() {
    const [refType, setRefType] = React.useState('branch')
    return (
      <>
        <UnderlinePanels
          value={refType}
          onChange={({value}) => {
            action('onChange')({value})
            setRefType(value)
          }}
        >
          <UnderlinePanels.List aria-label="Ref type">
            <UnderlinePanels.Tab value="branch" icon={GitBranchIcon}>
              Branches
            </UnderlinePanels.Tab>
            <UnderlinePanels.Tab value="tag" icon={TagIcon}>
              Tags
            </UnderlinePanels.Tab>
          </UnderlinePanels.List>
          <RefTypePanels />
        </UnderlinePanels>
        <p>
          Selected ref type: <strong>{refType}</strong>
        </p>
      </>
    )
  },
}

export const Uncontrolled: Story = {
  render: () => (
    <UnderlinePanels defaultValue="tag" onChange={({value}) => action('onChange')({value})}>
      <UnderlinePanels.List aria-label="Ref type">
        <UnderlinePanels.Tab value="branch">Branches</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="tag">Tags</UnderlinePanels.Tab>
      </UnderlinePanels.List>
      <RefTypePanels />
    </UnderlinePanels>
  ),
}

export const ManualActivation: Story = {
  render: function ManualActivation() {
    const [refType, setRefType] = React.useState('branch')
    return (
      <>
        <p>
          With <code>activationMode=&quot;manual&quot;</code>, arrow keys only move focus; press Enter or Space (or
          click) to commit selection. Prefer this when switching tabs triggers async work like a fetch.
        </p>
        <UnderlinePanels
          value={refType}
          activationMode="manual"
          onChange={({value}) => {
            action('onChange')({value})
            setRefType(value)
          }}
        >
          <UnderlinePanels.List aria-label="Ref type">
            <UnderlinePanels.Tab value="branch">Branches</UnderlinePanels.Tab>
            <UnderlinePanels.Tab value="tag">Tags</UnderlinePanels.Tab>
          </UnderlinePanels.List>
          <RefTypePanels />
        </UnderlinePanels>
      </>
    )
  },
}

export const InOverlay: StoryObj<{activationMode: 'automatic' | 'manual'; strictMode: boolean}> = {
  args: {activationMode: 'automatic', strictMode: false},
  argTypes: {
    activationMode: {control: 'select', options: ['automatic', 'manual']},
    strictMode: {control: 'boolean'},
  },
  render: function InOverlay({activationMode, strictMode}) {
    const [refType, setRefType] = React.useState('branch')
    const overlay = (
      <AnchoredOverlay>
        <AnchoredOverlay.Trigger render={<Button>Select ref type</Button>} />
        <AnchoredOverlay.Content role="dialog" aria-label="Select a ref type" className="w-80">
          <UnderlinePanels
            activationMode={activationMode}
            value={refType}
            onChange={({value}) => {
              action('onChange')({value})
              setRefType(value)
            }}
          >
            <UnderlinePanels.List aria-label="Ref type">
              <UnderlinePanels.Tab value="branch">Branches</UnderlinePanels.Tab>
              <UnderlinePanels.Tab value="tag">Tags</UnderlinePanels.Tab>
            </UnderlinePanels.List>
            <RefTypePanels />
          </UnderlinePanels>
        </AnchoredOverlay.Content>
      </AnchoredOverlay>
    )
    return strictMode ? <React.StrictMode>{overlay}</React.StrictMode> : overlay
  },
}
