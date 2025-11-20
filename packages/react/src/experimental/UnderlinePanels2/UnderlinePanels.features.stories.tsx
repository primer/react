import type {Meta} from '@storybook/react-vite'
import {INITIAL_VIEWPORTS} from 'storybook/viewport'
import {UnderlinePanels} from './UnderlinePanels'
import type {ComponentProps} from '../../utils/types'
import {
  CodeIcon,
  CommentDiscussionIcon,
  EyeIcon,
  GearIcon,
  GitPullRequestIcon,
  GraphIcon,
  PlayIcon,
  ShieldLockIcon,
} from '@primer/octicons-react'

export default {
  title: 'Experimental/Components/UnderlinePanels2/Features',
  component: UnderlinePanels,
} as Meta<ComponentProps<typeof UnderlinePanels>>

export const SelectedTab = () => (
  <UnderlinePanels id="tab-panels" defaultValue="tab-2">
    <UnderlinePanels.TabList aria-label="Select a tab">
      <UnderlinePanels.Tab value="tab-1">Tab 1</UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-2">Tab 2</UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-3">Tab 3</UnderlinePanels.Tab>
    </UnderlinePanels.TabList>
    <UnderlinePanels.Panel value="tab-1">Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-2">Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-3">Panel 3</UnderlinePanels.Panel>
  </UnderlinePanels>
)

export const LabelledByExternalElement = () => (
  <>
    <h2 id="my-heading">UnderlinePanels example</h2>
    <UnderlinePanels aria-labelledby="my-heading" defaultValue="tab-1">
      <UnderlinePanels.TabList aria-label="Select a tab">
        <UnderlinePanels.Tab value="tab-1">Tab 1</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="tab-2">Tab 2</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="tab-3">Tab 3</UnderlinePanels.Tab>
      </UnderlinePanels.TabList>
      <UnderlinePanels.Panel value="tab-1">Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="tab-2">Panel 2</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="tab-3">Panel 3</UnderlinePanels.Panel>
    </UnderlinePanels>
  </>
)

export const WithIcons = () => (
  <UnderlinePanels defaultValue="tab-1">
    <UnderlinePanels.TabList aria-label="Tabs with icons">
      <UnderlinePanels.Tab value="tab-1" icon={CodeIcon}>
        Tab 1
      </UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-2" icon={EyeIcon}>
        Tab 2
      </UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-3" icon={GitPullRequestIcon}>
        Tab 3
      </UnderlinePanels.Tab>
    </UnderlinePanels.TabList>
    <UnderlinePanels.Panel value="tab-1">Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-2">Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-3">Panel 3</UnderlinePanels.Panel>
  </UnderlinePanels>
)

export const WithIconsHiddenOnNarrowScreen = () => (
  <UnderlinePanels defaultValue="tab-1">
    <UnderlinePanels.TabList aria-label="Tabs with icons">
      <UnderlinePanels.Tab value="tab-1" icon={CodeIcon}>
        Tab 1
      </UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-2" icon={EyeIcon}>
        Tab 2
      </UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-3" icon={GitPullRequestIcon}>
        Tab 3
      </UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-4" icon={CommentDiscussionIcon}>
        Tab 4
      </UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-5" icon={PlayIcon}>
        Tab 5
      </UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-6" icon={GraphIcon}>
        Tab 6
      </UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-7" icon={GearIcon}>
        Tab 7
      </UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-8" icon={ShieldLockIcon}>
        Tab 8
      </UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-9" icon={ShieldLockIcon}>
        Tab 9
      </UnderlinePanels.Tab>
    </UnderlinePanels.TabList>
    <UnderlinePanels.Panel value="tab-1">Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-2">Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-3">Panel 3</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-4">Panel 4</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-5">Panel 5</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-6">Panel 6</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-7">Panel 7</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-8">Panel 8</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-9">Panel 9</UnderlinePanels.Panel>
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
    <UnderlinePanels defaultValue="tab-1">
      <UnderlinePanels.TabList aria-label="Tabs with counters">
        <UnderlinePanels.Tab counter="11K" value="tab-1">
          Tab 1
        </UnderlinePanels.Tab>
        <UnderlinePanels.Tab counter={12} value="tab-2">
          Tab 2
        </UnderlinePanels.Tab>
      </UnderlinePanels.TabList>
      <UnderlinePanels.Panel value="tab-1">Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="tab-2">Panel 2</UnderlinePanels.Panel>
    </UnderlinePanels>
  )
}

export const WithCountersInLoadingState = () => {
  return (
    <UnderlinePanels loadingCounters defaultValue="tab-1">
      <UnderlinePanels.TabList aria-label="Tabs with counters">
        <UnderlinePanels.Tab counter="11K" value="tab-1">
          Tab 1
        </UnderlinePanels.Tab>
        <UnderlinePanels.Tab counter={12} value="tab-2">
          Tab 2
        </UnderlinePanels.Tab>
      </UnderlinePanels.TabList>
      <UnderlinePanels.Panel value="tab-1">Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="tab-2">Panel 2</UnderlinePanels.Panel>
    </UnderlinePanels>
  )
}
