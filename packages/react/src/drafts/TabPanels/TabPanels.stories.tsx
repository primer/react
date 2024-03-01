import React from 'react'
import type {Meta, Story} from '@storybook/react'
import TabPanels from './TabPanels'
import type {ComponentProps} from '../../utils/types'

export default {
  title: 'Drafts/Components/TabPanels',
  component: TabPanels,
} as Meta<ComponentProps<typeof TabPanels>>

export const Playground: Story<ComponentProps<typeof TabPanels>> = args => (
  <TabPanels {...args} id="tab-panels">
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
}
Playground.argTypes = {
  'aria-label': {
    type: 'string',
  },
}

export const Default = () => (
  <TabPanels aria-label="Select a tab" id="tab-panels">
    <TabPanels.Tab>Tab 1</TabPanels.Tab>
    <TabPanels.Tab>Tab 2</TabPanels.Tab>
    <TabPanels.Tab>Tab 3</TabPanels.Tab>
    <TabPanels.Panel>Panel 1</TabPanels.Panel>
    <TabPanels.Panel>Panel 2</TabPanels.Panel>
    <TabPanels.Panel>Panel 3</TabPanels.Panel>
  </TabPanels>
)
