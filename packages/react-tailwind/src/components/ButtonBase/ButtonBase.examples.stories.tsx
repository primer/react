import {useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {ButtonBase} from './index'

const meta = {
  title: 'React Tailwind/Display/ButtonBase/Examples',
  component: ButtonBase,
} satisfies Meta<typeof ButtonBase>

export default meta
type Story = StoryObj<typeof meta>

export const SubmitForm: Story = {
  render: function SubmitFormStory() {
    const [submitted, setSubmitted] = useState(false)
    return (
      <form
        className="flex items-center gap-2"
        onSubmit={event => {
          event.preventDefault()
          setSubmitted(true)
        }}
      >
        <ButtonBase type="submit">Save changes</ButtonBase>
        {submitted && <span role="status">Changes saved</span>}
      </form>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Save changes'}))
    await expect(canvas.getByRole('status')).toHaveTextContent('Changes saved')
  },
}
