import React from 'react'
import {Meta} from '@storybook/react'
import TabPanels from './TabPanels'
import {ComponentProps} from '../utils/types'

export default {
  title: 'Components/TabPanels/Features',
  component: TabPanels,
} as Meta<ComponentProps<typeof TabPanels>>

export const Selected = () => (
  <TabPanels aria-label="Main">
  </TabPanels>
)
