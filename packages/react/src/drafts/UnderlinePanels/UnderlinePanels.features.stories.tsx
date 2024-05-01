import React from 'react'
import type {Meta} from '@storybook/react'
import UnderlinePanels from './UnderlinePanels'
import type {ComponentProps} from '../../utils/types'
import {CodeIcon, EyeIcon, GitPullRequestIcon} from '@primer/octicons-react'

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

export const LabelledByExternal = () => (
  <>
    <h1 id="my-heading">UnderlinePanels example</h1>
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

export const WithCounterLabels = () => {
  return (
    <UnderlinePanels aria-label="Tabs with counters">
      <UnderlinePanels.Tab counter="11K">Code</UnderlinePanels.Tab>
      <UnderlinePanels.Tab counter={12}>Issues</UnderlinePanels.Tab>
      <UnderlinePanels.Panel>Code panel</UnderlinePanels.Panel>
      <UnderlinePanels.Panel>Issues panel</UnderlinePanels.Panel>
    </UnderlinePanels>
  )
}

export const CountersLoadingState = () => {
  return (
    <UnderlinePanels aria-label="Tabs with counters" loadingCounters>
      <UnderlinePanels.Tab counter="11K">Code</UnderlinePanels.Tab>
      <UnderlinePanels.Tab counter={12}>Issues</UnderlinePanels.Tab>
      <UnderlinePanels.Panel>Code panel</UnderlinePanels.Panel>
      <UnderlinePanels.Panel>Issues panel</UnderlinePanels.Panel>
    </UnderlinePanels>
  )
}
