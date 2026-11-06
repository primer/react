import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Details} from './Details'

const meta = {title: 'React Tailwind/Forms/Details/Examples', component: Details} satisfies Meta<typeof Details>
export default meta
type Story = StoryObj<typeof meta>

export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(false)
    return (
      <Details open={open} onToggle={event => setOpen(event.currentTarget.open)}>
        <Details.Summary>More information</Details.Summary>
        Controlled content
      </Details>
    )
  },
  play: async ({canvasElement}) => {
    const summary = within(canvasElement).getByText('More information')
    await userEvent.click(summary)
    await expect(summary.closest('details')).toHaveAttribute('open')
  },
}

export const Uncontrolled: Story = {
  render: () => (
    <Details open>
      <Details.Summary>More information</Details.Summary>
      Uncontrolled content
    </Details>
  ),
  play: async ({canvasElement}) => {
    const summary = within(canvasElement).getByText('More information')
    await expect(summary.closest('details')).toHaveAttribute('open')
    await userEvent.click(summary)
    await expect(summary.closest('details')).not.toHaveAttribute('open')
  },
}
