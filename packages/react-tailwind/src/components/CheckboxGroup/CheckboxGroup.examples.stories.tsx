import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Checkbox} from '../Checkbox'
import {CheckboxGroup} from './CheckboxGroup'

const meta = {title: 'React Tailwind/Forms/CheckboxGroup/Examples', component: CheckboxGroup} satisfies Meta<
  typeof CheckboxGroup
>
export default meta
type Story = StoryObj<typeof meta>

function Choices() {
  return (
    <>
      <label className="flex items-center gap-2" htmlFor="checkbox-group-one">
        <Checkbox id="checkbox-group-one" value="one" />
        One
      </label>
      <label className="flex items-center gap-2" htmlFor="checkbox-group-two">
        <Checkbox id="checkbox-group-two" value="two" />
        Two
      </label>
    </>
  )
}

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState(['one'])
    return (
      <CheckboxGroup aria-label="Choices" value={value} onValueChange={setValue}>
        <Choices />
      </CheckboxGroup>
    )
  },
  play: async ({canvasElement}) => {
    const checkboxes = within(canvasElement).getAllByRole('checkbox')
    await userEvent.click(checkboxes[1])
    await expect(checkboxes[1]).toBeChecked()
  },
}

export const Uncontrolled: Story = {
  render: () => (
    <CheckboxGroup aria-label="Choices" defaultValue={['one']}>
      <Choices />
    </CheckboxGroup>
  ),
  play: async ({canvasElement}) => {
    const checkboxes = within(canvasElement).getAllByRole('checkbox')
    await expect(checkboxes[0]).toBeChecked()
    checkboxes[1].focus()
    await userEvent.keyboard('{Space}')
    await expect(checkboxes[1]).toBeChecked()
  },
}
