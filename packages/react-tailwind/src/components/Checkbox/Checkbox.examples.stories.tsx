import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Checkbox} from './Checkbox'
import {CheckboxField} from './Checkbox.storyHelpers'

const meta = {title: 'React Tailwind/Forms/Checkbox/Examples', component: Checkbox} satisfies Meta<typeof Checkbox>
export default meta
type Story = StoryObj<typeof meta>

export const Controlled: Story = {
  render: function ControlledStory() {
    const [checked, setChecked] = useState(false)
    return <CheckboxField checked={checked} onCheckedChange={setChecked} />
  },
}
export const Uncontrolled: Story = {
  render: () => <CheckboxField defaultChecked={false} />,
}
export const FormSubmission: Story = {
  render: function FormSubmissionStory() {
    const [submitted, setSubmitted] = useState('')
    return (
      <form
        onSubmit={event => {
          event.preventDefault()
          setSubmitted(String(new FormData(event.currentTarget).get('updates') ?? ''))
        }}
      >
        <label className="flex items-center gap-2" htmlFor="submission-checkbox">
          <Checkbox id="submission-checkbox" name="updates" value="yes" />
          Receive updates
        </label>
        <button type="submit">Submit</button>
        <output>{submitted}</output>
      </form>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('checkbox', {name: 'Receive updates'}))
    await userEvent.click(canvas.getByRole('button', {name: 'Submit'}))
    await expect(canvas.getByText('yes')).toBeVisible()
  },
}
