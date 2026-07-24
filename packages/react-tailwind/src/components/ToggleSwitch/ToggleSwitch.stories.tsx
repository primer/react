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
      <span id="toggle">Toggle label</span>
      <ToggleSwitch aria-labelledby="toggle" />
    </span>
  ),
}
export const Playground: Story = {args: {'aria-labelledby': 'toggle', size: 'medium', defaultChecked: false}}
