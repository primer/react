import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {FormControl} from './FormControl'

const meta = {title: 'React Tailwind/Forms/FormControl/Examples', component: FormControl} satisfies Meta<
  typeof FormControl
>
export default meta
type Story = StoryObj<typeof meta>

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState('')
    return (
      <FormControl>
        <FormControl.Label>Repository</FormControl.Label>
        <FormControl.Control value={value} onChange={event => setValue(event.target.value)} />
      </FormControl>
    )
  },
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole('textbox', {name: 'Repository'})
    await userEvent.type(input, 'primer/react')
    await expect(input).toHaveValue('primer/react')
  },
}

export const Uncontrolled: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label>Repository</FormControl.Label>
      <FormControl.Control defaultValue="primer/react" />
    </FormControl>
  ),
  play: async ({canvasElement}) =>
    expect(within(canvasElement).getByRole('textbox', {name: 'Repository'})).toHaveValue('primer/react'),
}
