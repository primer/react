import React from 'react'
import type {Meta} from '@storybook/react'
import UnderlinePanels from './UnderlinePanels'
import type {ComponentProps} from '../../utils/types'

export default {
  title: 'Drafts/Components/UnderlinePanels',
  component: UnderlinePanels,
} as Meta<ComponentProps<typeof UnderlinePanels>>

export const Default = () => (
  <UnderlinePanels aria-label="Select a tab">
    <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
    <UnderlinePanels.Tab>Tab 2</UnderlinePanels.Tab>
    <UnderlinePanels.Tab>Tab 3</UnderlinePanels.Tab>
    <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
  </UnderlinePanels>
)
