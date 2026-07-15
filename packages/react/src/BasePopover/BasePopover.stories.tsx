import type {Meta, StoryObj} from '@storybook/react-vite'
import {Close, Popover, Root, Trigger} from './BasePopover'

const meta = {
  title: 'Components/BasePopover',
  component: Root,
} satisfies Meta<typeof Root>

export default meta

type Story = StoryObj<typeof Root>

export const Default: Story = {
  render: args => (
    <Root {...args}>
      <Trigger>Toggle popover</Trigger>
      <Popover>Popover content</Popover>
    </Root>
  ),
}

export const Playground: Story = {
  render: args => (
    <Root {...args}>
      <Trigger>Toggle popover</Trigger>
      <Popover>
        Popover content
        <Close>Close popover</Close>
      </Popover>
    </Root>
  ),
  args: {
    id: 'base-popover-playground',
    popover: 'auto',
  },
  argTypes: {
    id: {
      control: 'text',
    },
    popover: {
      control: 'radio',
      options: ['auto', 'hint', 'manual'],
    },
  },
}
