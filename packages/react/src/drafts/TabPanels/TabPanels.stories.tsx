import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import TabPanels from './TabPanels'
import type {ComponentProps} from '../../utils/types'

export default {
  title: 'Drafts/Components/TabPanels',
  component: TabPanels,
} as Meta<ComponentProps<typeof TabPanels>>

export const Playground: StoryFn<ComponentProps<typeof TabPanels>> = args => (
  <TabPanels {...args}>
    <TabPanels.Tab>Tab 1</TabPanels.Tab>
    <TabPanels.Tab>Tab 2</TabPanels.Tab>
    <TabPanels.Tab>Tab 3</TabPanels.Tab>
    <TabPanels.Panel>Panel 1</TabPanels.Panel>
    <TabPanels.Panel>Panel 2</TabPanels.Panel>
    <TabPanels.Panel>Panel 3</TabPanels.Panel>
  </TabPanels>
)

Playground.args = {
  'aria-label': 'Select a tab',
  defaultTabIndex: 0,
  id: 'tab-panels',
}
Playground.argTypes = {
  'aria-label': {
    type: 'string',
  },
  selectedTabIndex: {
    type: 'number',
  },
  defaultTabIndex: {
    type: 'number',
  },
  id: {
    type: 'string',
  },
}

export const Default = () => (
  <TabPanels aria-label="Select a tab" id="tab-panels" defaultTabIndex={0}>
    <TabPanels.Tab>Tab 1</TabPanels.Tab>
    <TabPanels.Tab>Tab 2</TabPanels.Tab>
    <TabPanels.Tab>Tab 3</TabPanels.Tab>
    <TabPanels.Panel>Panel 1</TabPanels.Panel>
    <TabPanels.Panel>Panel 2</TabPanels.Panel>
    <TabPanels.Panel>Panel 3</TabPanels.Panel>
  </TabPanels>
)
