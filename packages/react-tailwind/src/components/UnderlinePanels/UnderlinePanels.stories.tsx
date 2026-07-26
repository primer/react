import type {Meta, StoryObj} from '@storybook/react-vite'
import {UnderlinePanels} from './UnderlinePanels'
const meta = {
  title: 'React Tailwind/Navigation/UnderlinePanels',
  component: UnderlinePanels,
  args: {defaultValue: 'one'},
  argTypes: {
    defaultValue: {control: 'select', options: ['one', 'two']},
  },
  parameters: {controls: {include: ['defaultValue']}},
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
  render: args => (
    <UnderlinePanels defaultValue={args.defaultValue}>
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
