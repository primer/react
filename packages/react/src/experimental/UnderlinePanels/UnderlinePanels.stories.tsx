import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import UnderlinePanels from './UnderlinePanels'

const meta: Meta<typeof UnderlinePanels> = {
  title: 'Experimental/Components/UnderlinePanels',
  component: UnderlinePanels,
  parameters: {
    controls: {
      expanded: true,
    },
  },
  argTypes: {
    'aria-label': {
      type: {
        name: 'string',
      },
    },
    'aria-labelledby': {
      type: {
        name: 'string',
      },
    },
    id: {
      type: {
        name: 'string',
      },
    },
    loadingCounters: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    'aria-label': 'Select a tab',
    'aria-labelledby': 'tab',
    id: 'test',
    loadingCounters: false,
  },
}

export default meta

export const Default: StoryFn<typeof UnderlinePanels> = () => {
  const tabs = ['Terminal', 'Output', 'Problems', 'Ports', 'Comments']
  return (
    <UnderlinePanels aria-label="Select a tab">
      {tabs.map((tab: string, index: number) => (
        <UnderlinePanels.Tab key={index} aria-selected={index === 0 ? true : undefined}>
          {tab}
        </UnderlinePanels.Tab>
      ))}
      {tabs.map((tab: string, index: number) => (
        <UnderlinePanels.Panel key={index}>{tab}</UnderlinePanels.Panel>
      ))}
    </UnderlinePanels>
  )
}

export const Playgound: StoryFn<typeof UnderlinePanels> = args => {
  const tabs = ['Terminal', 'Output', 'Problems', 'Ports', 'Comments']
  return (
    <UnderlinePanels {...args}>
      {tabs.map((tab: string, index: number) => (
        <UnderlinePanels.Tab key={index} aria-selected={index === 0 ? true : undefined}>
          {tab}
        </UnderlinePanels.Tab>
      ))}
      {tabs.map((tab: string, index: number) => (
        <UnderlinePanels.Panel key={index}>{tab}</UnderlinePanels.Panel>
      ))}
    </UnderlinePanels>
  )
}
