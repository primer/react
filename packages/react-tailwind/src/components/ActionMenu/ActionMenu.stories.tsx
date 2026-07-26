import type {Meta, StoryObj} from '@storybook/react-vite'
import {ActionMenu, type ActionMenuContentProps, type ActionMenuRootProps} from './ActionMenu'

interface ActionMenuStoryArgs
  extends Pick<ActionMenuRootProps, 'highlightItemOnHover' | 'loopFocus' | 'modal'>,
    Pick<ActionMenuContentProps, 'align' | 'side' | 'sideOffset'> {}

const meta = {
  title: 'React Tailwind/Components/ActionMenu',
  args: {
    align: 'start',
    highlightItemOnHover: true,
    loopFocus: true,
    modal: true,
    side: 'bottom',
    sideOffset: 4,
  },
  argTypes: {
    align: {control: 'select', options: ['start', 'center', 'end']},
    highlightItemOnHover: {control: 'boolean'},
    loopFocus: {control: 'boolean'},
    modal: {control: 'boolean'},
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    },
    sideOffset: {control: {type: 'number', min: 0}},
  },
} satisfies Meta<ActionMenuStoryArgs>

export default meta

type Story = StoryObj<ActionMenuStoryArgs>
export const Default: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.Item>Copy link</ActionMenu.Item>
        <ActionMenu.Item>Quote reply</ActionMenu.Item>
        <ActionMenu.Item>Edit comment</ActionMenu.Item>
        <ActionMenu.Item variant="danger">Delete file</ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
export const Playground: Story = {
  render: args => (
    <ActionMenu highlightItemOnHover={args.highlightItemOnHover} loopFocus={args.loopFocus} modal={args.modal}>
      <ActionMenu.Button>Labels</ActionMenu.Button>
      <ActionMenu.Content align={args.align} side={args.side} sideOffset={args.sideOffset}>
        <ActionMenu.CheckboxItem>Bug</ActionMenu.CheckboxItem>
        <ActionMenu.CheckboxItem checked>Feature</ActionMenu.CheckboxItem>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
