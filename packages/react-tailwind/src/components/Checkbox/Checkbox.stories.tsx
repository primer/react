import type {Meta, StoryObj} from '@storybook/react-vite'
import {Checkbox} from './Checkbox'
const meta = {
  title: 'React Tailwind/Forms/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <span className="flex gap-2">
      <Checkbox id="receive-updates" />
      <label htmlFor="receive-updates">Receive updates</label>
    </span>
  ),
}
export const Playground: Story = {args: {'aria-label': 'Receive updates', defaultChecked: true, disabled: false}}
