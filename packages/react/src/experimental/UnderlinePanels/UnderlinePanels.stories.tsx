import type {Meta, StoryFn} from '@storybook/react-vite'
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
    id: 'test',
    loadingCounters: false,
  },
}

export default meta

export const Default: StoryFn<typeof UnderlinePanels> = () => {
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3']
  const panels = ['Panel 1', 'Panel 2', 'Panel 3']

  return (
    <UnderlinePanels aria-label="Select a tab">
      {tabs.map((tab: string, index: number) => (
        <UnderlinePanels.Tab key={index} aria-selected={index === 0 ? true : undefined}>
          {tab}
        </UnderlinePanels.Tab>
      ))}
      {panels.map((panel: string, index: number) => (
        <UnderlinePanels.Panel key={index}>{panel}</UnderlinePanels.Panel>
      ))}
    </UnderlinePanels>
  )
}

export const Playgound: StoryFn<typeof UnderlinePanels> = args => {
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3']
  const panels = ['Panel 1', 'Panel 2', 'Panel 3']

  return (
    <UnderlinePanels {...args}>
      {tabs.map((tab: string, index: number) => (
        <UnderlinePanels.Tab key={index} aria-selected={index === 0 ? true : undefined}>
          {tab}
        </UnderlinePanels.Tab>
      ))}
      {panels.map((panel: string, index: number) => (
        <UnderlinePanels.Panel key={index}>{panel}</UnderlinePanels.Panel>
      ))}
    </UnderlinePanels>
  )
}
