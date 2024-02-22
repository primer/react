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
    <TabPanels.Tab id="tab-2" selected>Two</TabPanels.Tab>
    <TabPanels.Tab id="tab-3">Three</TabPanels.Tab>
    <TabPanels.Panel aria-labelledby="tab-1">One</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-2">Two</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-3">Three</TabPanels.Panel>
  </TabPanels>
)

export const AdditionalContent = () => (
  <TabPanels aria-label="Main">
    <TabPanels.Tab id="tab-1">One</TabPanels.Tab>
    <TabPanels.Tab id="tab-2">Two</TabPanels.Tab>
    <TabPanels.Tab id="tab-3">Three</TabPanels.Tab>
    <Button>Non-tab content</Button>
    <TabPanels.Panel aria-labelledby="tab-1">One</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-2">Two</TabPanels.Panel>
    <TabPanels.Panel aria-labelledby="tab-3">Three</TabPanels.Panel>
    <div>Additional content after the panels</div>
  </TabPanels>
)
