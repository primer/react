import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Flash} from './Flash'

const meta = {
  title: 'React Tailwind/Content/Flash/Examples',
  component: Flash,
} satisfies Meta<typeof Flash>

export default meta
type Story = StoryObj<typeof meta>

export const Dismissible: Story = {
  render: function DismissibleStory() {
    const [visible, setVisible] = useState(true)
    return visible ? (
      <Flash variant="success" role="status">
        Changes saved{' '}
        <button type="button" aria-label="Dismiss" onClick={() => setVisible(false)}>
          ×
        </button>
      </Flash>
    ) : (
      <p>Flash dismissed</p>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Dismiss'}))
    await expect(canvas.getByText('Flash dismissed')).toBeInTheDocument()
  },
}

export const FullWidthNotice: Story = {
  render: () => (
    <Flash full variant="warning">
      Your session will expire soon. <a href="/">Sign in again</a> to continue.
    </Flash>
  ),
}

export const CustomContent: Story = {
  render: () => (
    <Flash>
      <h3 className="m-0 text-base font-semibold">Maintenance scheduled</h3>
      <p>Some features may be unavailable during the scheduled maintenance window.</p>
    </Flash>
  ),
}
