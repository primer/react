import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Radio} from '../Radio'
import {RadioGroup} from './RadioGroup'

const meta = {title: 'React Tailwind/Forms/RadioGroup/Examples', component: RadioGroup} satisfies Meta<
  typeof RadioGroup
>
export default meta
type Story = StoryObj<typeof meta>

function Choices() {
  return (
    <>
      <label className="flex items-center gap-2" htmlFor="radio-group-one">
        <Radio id="radio-group-one" value="one" />
        One
      </label>
      <label className="flex items-center gap-2" htmlFor="radio-group-two">
        <Radio id="radio-group-two" value="two" />
        Two
      </label>
    </>
  )
}

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState('one')
    return (
      <RadioGroup aria-label="Choices" value={value} onValueChange={setValue}>
        <Choices />
      </RadioGroup>
    )
  },
  play: async ({canvasElement}) => {
    const radios = within(canvasElement).getAllByRole('radio')
    await userEvent.click(radios[1])
    await expect(radios[1]).toBeChecked()
  },
}

export const Uncontrolled: Story = {
  render: () => (
    <RadioGroup aria-label="Choices" defaultValue="one">
      <Choices />
    </RadioGroup>
  ),
  play: async ({canvasElement}) => {
    const radios = within(canvasElement).getAllByRole('radio')
    radios[0].focus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(radios[1]).toBeChecked()
  },
}
