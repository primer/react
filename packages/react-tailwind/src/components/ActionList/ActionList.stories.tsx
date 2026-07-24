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
      <ActionList.Item>Open</ActionList.Item>
      <ActionList.Item>Close</ActionList.Item>
    </ActionList>
  ),
}
export const Playground: Story = {
  render: () => (
    <ActionList role="listbox" selectionVariant="single">
      <ActionList.Item selected>Selected option</ActionList.Item>
    </ActionList>
  ),
}
