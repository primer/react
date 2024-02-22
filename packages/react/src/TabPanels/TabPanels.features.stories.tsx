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
  <TabPanels aria-label="Main">
    <TabPanels.Tab id="tab-1">One</TabPanels.Tab>
    <TabPanels.Tab id="tab-2" selected>
      Two
    </TabPanels.Tab>
    <TabPanels.Tab id="tab-3">Three</TabPanels.Tab>
    <TabPanels.Panel aria-labelledby="tab-1">One</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-2">Two</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-3">Three</TabPanels.Panel>
  </TabPanels>
)

export const AdditionalContent = () => (
  <TabPanels aria-label="Main">
    <Button>Non-tab content (before tabs)</Button>
    <TabPanels.Tab id="tab-1">One</TabPanels.Tab>
    <TabPanels.Tab id="tab-2">Two</TabPanels.Tab>
    <TabPanels.Tab id="tab-3">Three</TabPanels.Tab>
    <Button>Non-tab content (after tabs)</Button>
    <TabPanels.Panel aria-labelledby="tab-1">One</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-2">Two</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-3">Three</TabPanels.Panel>
    <div>Additional content after the panels</div>
  </TabPanels>
)

export const ManyTabs = () => (
  <TabPanels aria-label="Main">
    <TabPanels.Tab id="tab-1">One</TabPanels.Tab>
    <TabPanels.Tab id="tab-2">Two</TabPanels.Tab>
    <TabPanels.Tab id="tab-3">Three</TabPanels.Tab>
    <TabPanels.Tab id="tab-4">Four</TabPanels.Tab>
    <TabPanels.Tab id="tab-5">Five</TabPanels.Tab>
    <TabPanels.Tab id="tab-6">Six</TabPanels.Tab>
    <TabPanels.Tab id="tab-7">Seven</TabPanels.Tab>
    <TabPanels.Tab id="tab-8">Eight</TabPanels.Tab>
    <TabPanels.Tab id="tab-9">Nine</TabPanels.Tab>
    <TabPanels.Tab id="tab-10">Ten</TabPanels.Tab>
    <TabPanels.Tab id="tab-11" selected>Eleven</TabPanels.Tab>
    <TabPanels.Panel aria-labelledby="tab-1">One</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-2">Two</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-3">Three</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-4">Four</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-5">Five</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-6">Six</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-7">Seven</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-8">Eight</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-9">Nine</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-10">Ten</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-11">Eleven</TabPanels.Panel>
  </TabPanels>
)