import type {Meta, StoryFn} from '@storybook/react-vite'
import {UnderlinePanels} from './UnderlinePanels'

const meta: Meta<typeof UnderlinePanels> = {
  title: 'Experimental/Components/UnderlinePanels2',
  component: UnderlinePanels,
  parameters: {
    controls: {
      expanded: true,
    },
  },
  argTypes: {
    id: {
      type: {
        name: 'string',
      },
    },
    defaultValue: {
      type: {
        required: true,
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
    id: 'test',
    loadingCounters: false,
    defaultValue: 'tab-0',
  },
}

export default meta

export const Default: StoryFn<typeof UnderlinePanels> = () => {
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3']
  const panels = ['Panel 1', 'Panel 2', 'Panel 3']

  return (
    <UnderlinePanels defaultValue="tab-0">
      <UnderlinePanels.TabList aria-label="Select a tab">
        {tabs.map((tab: string, index: number) => (
          <UnderlinePanels.Tab value={`tab-${index}`} key={index}>
            {tab}
          </UnderlinePanels.Tab>
        ))}
      </UnderlinePanels.TabList>
      {panels.map((panel: string, index: number) => (
        <UnderlinePanels.Panel key={index} value={`tab-${index}`}>
          {panel}
        </UnderlinePanels.Panel>
      ))}
    </UnderlinePanels>
  )
}

export const Playground: StoryFn<typeof UnderlinePanels> = args => {
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3']
  const panels = ['Panel 1', 'Panel 2', 'Panel 3']

  return (
    <UnderlinePanels {...args}>
      <UnderlinePanels.TabList aria-label="Select a tab">
        {tabs.map((tab: string, index: number) => (
          <UnderlinePanels.Tab key={index} value={`tab-${index}`}>
            {tab}
          </UnderlinePanels.Tab>
        ))}
      </UnderlinePanels.TabList>
      {panels.map((panel: string, index: number) => (
        <UnderlinePanels.Panel key={index} value={`tab-${index}`}>
          {panel}
        </UnderlinePanels.Panel>
      ))}
    </UnderlinePanels>
  )
}
