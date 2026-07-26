import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {TextInput} from './TextInput'

const meta = {title: 'React Tailwind/Forms/TextInput/Examples', component: TextInput} satisfies Meta<typeof TextInput>
export default meta
type Story = StoryObj<typeof meta>

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState('')
    return <TextInput aria-label="Repository" value={value} onChange={event => setValue(event.target.value)} />
  },
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole('textbox')
    await userEvent.type(input, 'github/primer')
    await expect(input).toHaveValue('github/primer')
  },
}

export const Uncontrolled: Story = {
  render: () => <TextInput aria-label="Repository" defaultValue="github/primer" />,
  play: async ({canvasElement}) => expect(within(canvasElement).getByRole('textbox')).toHaveValue('github/primer'),
}
