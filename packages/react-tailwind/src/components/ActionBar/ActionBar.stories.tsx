import type {Meta, StoryObj} from '@storybook/react-vite'
import {ActionBar} from './ActionBar'
const meta = {
  title: 'React Tailwind/Data/ActionBar',
  component: ActionBar,
} satisfies Meta<typeof ActionBar>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <ActionBar aria-label="File actions">
      <ActionBar.Button>Copy</ActionBar.Button>
      <ActionBar.Button>Move</ActionBar.Button>
      <ActionBar.Divider />
      <ActionBar.Menu aria-label="More actions" items={[{label: 'Delete'}]} />
    </ActionBar>
  ),
}
