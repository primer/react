import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {RadioGroup} from '../RadioGroup'
import {Radio} from './Radio'

const meta = {title: 'React Tailwind/Forms/Radio/Examples', component: Radio, args: {value: 'choice'}} satisfies Meta<
  typeof Radio
>
export default meta
type Story = StoryObj<typeof meta>

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState('choice')
    return (
      <RadioGroup aria-label="Controlled choices" value={value} onValueChange={setValue}>
        <Radio aria-label="Controlled choice" value="choice" />
      </RadioGroup>
    )
  },
  play: async ({canvasElement}) => {
    const radio = within(canvasElement).getByRole('radio')
    await userEvent.click(radio)
    await expect(radio).toBeChecked()
  },
}

export const Uncontrolled: Story = {
  render: () => (
    <RadioGroup aria-label="Uncontrolled choices" defaultValue="choice">
      <Radio aria-label="Uncontrolled choice" value="choice" />
    </RadioGroup>
  ),
  play: async ({canvasElement}) => expect(within(canvasElement).getByRole('radio')).toBeChecked(),
}
