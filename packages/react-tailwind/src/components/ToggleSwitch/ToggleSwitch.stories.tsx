import type {Meta, StoryObj} from '@storybook/react-vite'
import {ToggleSwitch} from './ToggleSwitch'
const meta = {
  title: 'React Tailwind/Forms/ToggleSwitch',
  component: ToggleSwitch,
} satisfies Meta<typeof ToggleSwitch>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <span className="flex gap-2">
      <ToggleSwitch id="enable-notifications" />
      <label htmlFor="enable-notifications">Enable notifications</label>
    </span>
  ),
}
export const Playground: Story = {args: {'aria-label': 'Enable notifications', size: 'medium', defaultChecked: false}}
