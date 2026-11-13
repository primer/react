import type {Meta, StoryObj} from '@storybook/react-vite'
import {FormControl} from '../FormControl'
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
    <form>
      <FormControl layout="horizontal">
        <Radio value="default" />
        <FormControl.Label>Label</FormControl.Label>
      </FormControl>
    </form>
  ),
}
export const Playground: Story = {
  args: {value: 'default', disabled: false},
  render: args => (
    <form>
      <FormControl layout="horizontal">
        <Radio {...args} />
        <FormControl.Label>Label</FormControl.Label>
      </FormControl>
    </form>
  ),
}
