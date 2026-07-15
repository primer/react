import type {Meta, StoryObj} from '@storybook/react-vite'
import {Close, Popover, Root, Trigger} from './BasePopover'

const meta = {
  title: 'Components/BasePopover/Features',
  component: Root,
} satisfies Meta<typeof Root>

export default meta

type Story = StoryObj<typeof Root>

export const Auto: Story = {
  render: () => (
    <>
      <Root popover="auto">
        <Trigger>Toggle popover</Trigger>
        <Popover>Popover content</Popover>
      </Root>
      <button type="button">Outside action</button>
    </>
  ),
}

export const Hint: Story = {
  render: () => (
    <>
      <Root popover="hint">
        <Trigger>Toggle popover</Trigger>
        <Popover>Popover content</Popover>
      </Root>
      <button type="button">Outside action</button>
    </>
  ),
}

export const Manual: Story = {
  render: () => (
    <>
      <Root popover="manual">
        <Trigger>Toggle popover</Trigger>
        <Popover>
          Popover content
          <Close>Close popover</Close>
        </Popover>
      </Root>
      <button type="button">Outside action</button>
    </>
  ),
}
