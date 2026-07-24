import type {Meta, StoryObj} from '@storybook/react-vite'
import {ActionList} from './ActionList'

const meta = {
  title: 'React Tailwind/Components/ActionList',
  component: ActionList,
} satisfies Meta<typeof ActionList>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <ActionList>
      <ActionList.Item>Copy link</ActionList.Item>
      <ActionList.Item>Quote reply</ActionList.Item>
      <ActionList.Item>Edit comment</ActionList.Item>
    </ActionList>
  ),
}
export const Playground: Story = {
  render: () => (
    <ActionList role="listbox" aria-label="Options" selectionVariant="single">
      <ActionList.Item>Copy link</ActionList.Item>
      <ActionList.Item>Quote reply</ActionList.Item>
      <ActionList.Item>Edit comment</ActionList.Item>
    </ActionList>
  ),
}
