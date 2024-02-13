import React from 'react'
import {Meta, Story} from '@storybook/react'
import TabPanels from './TabPanels'
import {ComponentProps} from '../utils/types'

export default {
  title: 'Components/TabPanels',
  component: TabPanels,
} as Meta<ComponentProps<typeof TabPanels>>

export const Playground: Story<ComponentProps<typeof TabPanels>> = args => <TabPanels {...args}></TabPanels>

Playground.args = {
  'aria-label': 'Navigation',
}
Playground.argTypes = {
  'aria-label': {
    type: 'string',
  },
}

export const Default = () => (
  <TabPanels aria-label="Main">
    <TabPanels.Tab>Tab 1</TabPanels.Tab>
    <TabPanels.Tab>Tab 2</TabPanels.Tab>
    <TabPanels.Tab>Tab 3</TabPanels.Tab>
    <TabPanels.Panel>Panel 1</TabPanels.Panel>
    <TabPanels.Panel>Panel 2</TabPanels.Panel>
    <TabPanels.Panel>Panel 3</TabPanels.Panel>
  </TabPanels>
)
