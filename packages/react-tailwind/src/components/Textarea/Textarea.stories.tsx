import type {Meta, StoryObj} from '@storybook/react-vite'
import {FormControl} from '../FormControl'
import {Textarea} from './Textarea'
const meta = {
  title: 'React Tailwind/Forms/Textarea',
  component: Textarea,
  render: args => (
    <form>
      <FormControl>
        <FormControl.Label>Label</FormControl.Label>
        <Textarea {...args} />
      </FormControl>
    </form>
  ),
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: args => (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <Textarea {...args} />
      </FormControl>
    </form>
  ),
}
export const Playground: Story = {
  args: {autoSize: false, block: false, cols: 30, disabled: false, resize: 'both', rows: 7},
  argTypes: {
    autoSize: {control: {type: 'boolean'}},
    block: {control: {type: 'boolean'}},
    resize: {control: {type: 'radio'}, options: ['none', 'both', 'horizontal', 'vertical']},
    validationStatus: {control: {type: 'radio'}, options: ['error', 'success', undefined]},
  },
}
