import type {Meta, StoryObj} from '@storybook/react-vite'
import {UnderlinePanels} from './UnderlinePanels'
const meta = {
  title: 'React Tailwind/Navigation/UnderlinePanels',
  component: UnderlinePanels,
  args: {'aria-label': 'Select a tab', id: 'test', loadingCounters: false, defaultValue: 'one'},
  argTypes: {
    'aria-label': {control: 'text'},
    id: {control: 'text'},
    loadingCounters: {control: 'boolean'},
    defaultValue: {control: 'select', options: ['one', 'two', 'three']},
    activationMode: {control: 'radio', options: ['automatic', 'manual']},
  },
  parameters: {
    controls: {expanded: true, include: ['aria-label', 'id', 'loadingCounters', 'defaultValue', 'activationMode']},
  },
} satisfies Meta<typeof UnderlinePanels>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <UnderlinePanels defaultValue="one">
      <UnderlinePanels.List aria-label="Select a tab">
        <UnderlinePanels.Tab value="one">Tab 1</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="two">Tab 2</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="three">Tab 3</UnderlinePanels.Tab>
      </UnderlinePanels.List>
      <UnderlinePanels.Panel value="one">Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="two">Panel 2</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="three">Panel 3</UnderlinePanels.Panel>
    </UnderlinePanels>
  ),
}

export const Playground: Story = {
  render: ({'aria-label': ariaLabel, ...args}) => (
    <UnderlinePanels {...args}>
      <UnderlinePanels.List aria-label={ariaLabel}>
        <UnderlinePanels.Tab value="one">Tab 1</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="two">Tab 2</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="three">Tab 3</UnderlinePanels.Tab>
      </UnderlinePanels.List>
      <UnderlinePanels.Panel value="one">Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="two">Panel 2</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="three">Panel 3</UnderlinePanels.Panel>
    </UnderlinePanels>
  ),
}

/** Mirrors the upstream story id, which keeps its historical `Playgound` spelling. */
export const Playgound: Story = {...Playground, tags: ['!autodocs']}
