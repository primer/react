import React from 'react'
import {Meta, Story} from '@storybook/react'
import TabPanels from './TabPanels'
import {ComponentProps} from '../utils/types'

export default {
  title: 'Components/TabPanels',
  component: TabPanels,
} as Meta<ComponentProps<typeof TabPanels>>

export const Playground: Story<ComponentProps<typeof TabPanels>> = args => (
  <TabPanels {...args}>
  </TabPanels>
)

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
    <TabPanels.Tab>One</TabPanels.Tab>
    <TabPanels.Tab>Two</TabPanels.Tab>
    <TabPanels.Panel>One</TabPanels.Panel>
    <TabPanels.Panel>Two</TabPanels.Panel>
  </TabPanels>
)
