import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Textarea} from './Textarea'

const meta = {title: 'React Tailwind/Forms/Textarea/Examples', component: Textarea} satisfies Meta<typeof Textarea>
export default meta
type Story = StoryObj<typeof meta>

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState('')
    return <Textarea aria-label="Description" value={value} onChange={event => setValue(event.target.value)} />
  },
  play: async ({canvasElement}) => {
    const textarea = within(canvasElement).getByRole('textbox')
    await userEvent.type(textarea, 'A description')
    await expect(textarea).toHaveValue('A description')
  },
}

export const Uncontrolled: Story = {
  render: () => <Textarea aria-label="Description" defaultValue="Initial description" />,
  play: async ({canvasElement}) =>
    expect(within(canvasElement).getByRole('textbox')).toHaveValue('Initial description'),
}
