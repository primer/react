import type {Meta, StoryObj} from '@storybook/react-vite'
import {Radio} from './Radio'
const meta = {
  title: 'React Tailwind/Forms/Radio',
  component: Radio,
  args: {
    value: 'one',
  },
} satisfies Meta<typeof Radio>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <span className="flex gap-2">
      <Radio id="one" value="one" />
      <label htmlFor="one">Label</label>
    </span>
  ),
}
export const Playground: Story = {
  args: {'aria-label': 'Label', value: 'default', disabled: false},
}
