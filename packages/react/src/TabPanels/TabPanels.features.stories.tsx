import React from 'react'
import type {Meta} from '@storybook/react'
import TabPanels from './TabPanels'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Components/TabPanels/Features',
  component: TabPanels,
} as Meta<ComponentProps<typeof TabPanels>>

export const Selected = () => (
  <TabPanels aria-label="Main">
    <TabPanels.Tab>One</TabPanels.Tab>
    <TabPanels.Tab selected>Two</TabPanels.Tab>
    <TabPanels.Tab>Three</TabPanels.Tab>
    <TabPanels.Panel>One</TabPanels.Panel>
    <TabPanels.Panel>Two</TabPanels.Panel>
    <TabPanels.Panel>Three</TabPanels.Panel>
  </TabPanels>
)
