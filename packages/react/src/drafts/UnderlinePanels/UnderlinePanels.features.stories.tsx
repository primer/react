import React from 'react'
import type {Meta} from '@storybook/react'
import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport'
import UnderlinePanels from './UnderlinePanels'
import type {ComponentProps} from '../../utils/types'
import {
  CodeIcon,
  CommentDiscussionIcon,
  EyeIcon,
  GearIcon,
  GitPullRequestIcon,
  GraphIcon,
  PlayIcon,
  ProjectIcon,
  ShieldLockIcon,
} from '@primer/octicons-react'

export default {
  title: 'Drafts/Components/UnderlinePanels/Features',
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
    <UnderlinePanels.Tab icon={CodeIcon}>Code</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={EyeIcon}>Issues</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={GitPullRequestIcon}>Pull requests</UnderlinePanels.Tab>
    <UnderlinePanels.Panel>Code panel</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Issues panel</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Pull requests panel</UnderlinePanels.Panel>
  </UnderlinePanels>
)

export const WithIconsHiddenOnNarrowScreen = () => (
  <UnderlinePanels aria-label="Tabs with icons">
    <UnderlinePanels.Tab icon={CodeIcon}>Code</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={EyeIcon}>Issues</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={GitPullRequestIcon}>Pull requests</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={CommentDiscussionIcon}>Discussions</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={PlayIcon}>Actions</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={ProjectIcon}>Projects</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={GraphIcon}>Insights</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={GearIcon}>Settings</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={ShieldLockIcon}>Security</UnderlinePanels.Tab>
    <UnderlinePanels.Panel>Code panel</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Issues panel</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Pull requests panel</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Discussions panel</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Actions panel</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Projects panel</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Insights panel</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Settings panel</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Security panel</UnderlinePanels.Panel>
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
      <UnderlinePanels.Tab counter="11K">Code</UnderlinePanels.Tab>
      <UnderlinePanels.Tab counter={12}>Issues</UnderlinePanels.Tab>
      <UnderlinePanels.Panel>Code panel</UnderlinePanels.Panel>
      <UnderlinePanels.Panel>Issues panel</UnderlinePanels.Panel>
    </UnderlinePanels>
  )
}

export const WithCountersInLoadingState = () => {
  return (
    <UnderlinePanels aria-label="Tabs with counters" loadingCounters>
      <UnderlinePanels.Tab counter="11K">Code</UnderlinePanels.Tab>
      <UnderlinePanels.Tab counter={12}>Issues</UnderlinePanels.Tab>
      <UnderlinePanels.Panel>Code panel</UnderlinePanels.Panel>
      <UnderlinePanels.Panel>Issues panel</UnderlinePanels.Panel>
    </UnderlinePanels>
  )
}
