import React from 'react'
import type {Meta, Story} from '@storybook/react'
import TabPanels from './TabPanels'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Components/TabPanels',
  component: TabPanels,
} as Meta<ComponentProps<typeof TabPanels>>

export const Playground: Story<ComponentProps<typeof TabPanels>> = args => (
  <TabPanels {...args}>
    <TabPanels.Tab id="tab-1">Tab 1</TabPanels.Tab>
    <TabPanels.Tab id="tab-2">Tab 2</TabPanels.Tab>
    <TabPanels.Tab id="tab-3">Tab 3</TabPanels.Tab>
    <TabPanels.Panel aria-labelledby="tab-1">Panel 1</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-2">Panel 2</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-3">Panel 3</TabPanels.Panel>
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
  <TabPanels aria-label="Select a tab">
    <TabPanels.Tab id="tab-1">Tab 1</TabPanels.Tab>
    <TabPanels.Tab id="tab-2">Tab 2</TabPanels.Tab>
    <TabPanels.Tab id="tab-3">Tab 3</TabPanels.Tab>
    <TabPanels.Panel aria-labelledby="tab-1">Panel 1</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-2">Panel 2</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-3">Panel 3</TabPanels.Panel>
  </TabPanels>
)
