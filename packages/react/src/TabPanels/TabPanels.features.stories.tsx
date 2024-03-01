import React from 'react'
import type {Meta} from '@storybook/react'
import TabPanels from './TabPanels'
import type {ComponentProps} from '../utils/types'
import {Button} from '../Button'

export default {
  title: 'Components/TabPanels/Features',
  component: TabPanels,
} as Meta<ComponentProps<typeof TabPanels>>

export const Selected = () => (
  <TabPanels aria-label="TabPanels example" id="tab-panels">
    <TabPanels.Tab>One</TabPanels.Tab>
    <TabPanels.Tab selected>
      Two
    </TabPanels.Tab>
    <TabPanels.Tab>Three</TabPanels.Tab>
    <TabPanels.Panel>One</TabPanels.Panel>
    <TabPanels.Panel>Two</TabPanels.Panel>
    <TabPanels.Panel>Three</TabPanels.Panel>
  </TabPanels>
)

export const AdditionalContent = () => (
  <TabPanels aria-label="TabPanels example" id="tab-panels">
    <Button>Non-tab content (before tabs)</Button>
    <TabPanels.Tab>One</TabPanels.Tab>
    <TabPanels.Tab>Two</TabPanels.Tab>
    <TabPanels.Tab>Three</TabPanels.Tab>
    <Button>Non-tab content (after tabs)</Button>
    <TabPanels.Panel>One</TabPanels.Panel>
    <TabPanels.Panel>Two</TabPanels.Panel>
    <TabPanels.Panel>Three</TabPanels.Panel>
    <div>Additional content after the panels</div>
  </TabPanels>
)

export const ManyTabs = () => (
  <TabPanels aria-label="TabPanels example" id="tab-panels">
    <TabPanels.Tab>One</TabPanels.Tab>
    <TabPanels.Tab>Two</TabPanels.Tab>
    <TabPanels.Tab>Three</TabPanels.Tab>
    <TabPanels.Tab>Four</TabPanels.Tab>
    <TabPanels.Tab>Five</TabPanels.Tab>
    <TabPanels.Tab>Six</TabPanels.Tab>
    <TabPanels.Tab>Seven</TabPanels.Tab>
    <TabPanels.Tab>Eight</TabPanels.Tab>
    <TabPanels.Tab>Nine</TabPanels.Tab>
    <TabPanels.Tab>Ten</TabPanels.Tab>
    <TabPanels.Tab selected>
      Eleven
    </TabPanels.Tab>
    <TabPanels.Panel>One</TabPanels.Panel>
    <TabPanels.Panel>Two</TabPanels.Panel>
    <TabPanels.Panel>Three</TabPanels.Panel>
    <TabPanels.Panel>Four</TabPanels.Panel>
    <TabPanels.Panel>Five</TabPanels.Panel>
    <TabPanels.Panel>Six</TabPanels.Panel>
    <TabPanels.Panel>Seven</TabPanels.Panel>
    <TabPanels.Panel>Eight</TabPanels.Panel>
    <TabPanels.Panel>Nine</TabPanels.Panel>
    <TabPanels.Panel>Ten</TabPanels.Panel>
    <TabPanels.Panel>Eleven</TabPanels.Panel>
  </TabPanels>
)
