import type {Meta, StoryObj} from '@storybook/react-vite'
import {ActionMenu} from './ActionMenu'

const meta = {
  title: 'React Tailwind/Components/ActionMenu',
  component: ActionMenu,
} satisfies Meta<typeof ActionMenu>

export default meta

type Story = StoryObj<typeof meta>
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
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Labels</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.CheckboxItem>Bug</ActionMenu.CheckboxItem>
        <ActionMenu.CheckboxItem checked>Feature</ActionMenu.CheckboxItem>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
