import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {FormControl} from '../FormControl'
import {TextInput} from './TextInput'
const meta = {
  title: 'React Tailwind/Forms/TextInput',
  component: TextInput,
  argTypes: {
    leadingVisual: {control: false},
    trailingAction: {control: false},
    trailingVisual: {control: false},
  },
} satisfies Meta<typeof TextInput>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput />
      </FormControl>
    </form>
  ),
}
export const Playground: Story = {
  args: {
    block: false,
    contrast: false,
    disabled: false,
    loading: false,
    monospace: false,
    size: 'medium',
    type: 'text',
  },
  render: function PlaygroundStory(args) {
    const [value, setValue] = useState('')
    return (
      <form>
        <FormControl>
          <FormControl.Label>Label</FormControl.Label>
          <TextInput {...args} value={value} onChange={event => setValue(event.target.value)} />
        </FormControl>
      </form>
    )
  },
}
