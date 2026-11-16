import {DownloadIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Banner} from '../Banner'
import {Button} from './Button'

const meta = {
  title: 'React Tailwind/Display/Button/Examples',
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

function LoadingStatusAnnouncementSuccessfulStory() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  return (
    <>
      <span aria-live="polite">{success ? 'Export completed' : null}</span>
      <Button
        leadingVisual={<DownloadIcon />}
        loading={loading}
        onClick={() => {
          setLoading(true)
          setSuccess(true)
        }}
      >
        Export (success)
      </Button>
    </>
  )
}

export const LoadingStatusAnnouncementSuccessful: Story = {render: LoadingStatusAnnouncementSuccessfulStory}

export const LoadingStatusAnnouncementSuccessfulInteractive: Story = {
  render: LoadingStatusAnnouncementSuccessfulStory,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: /Export \(success\)/}))
    await expect(canvas.getByText('Export completed')).toBeInTheDocument()
  },
}

function LoadingStatusAnnouncementErrorStory() {
  const [error, setError] = useState(false)
  return (
    <>
      {error ? <Banner title="Export failed" variant="critical" /> : null}
      <Button leadingVisual={<DownloadIcon />} onClick={() => setError(true)}>
        Export (error)
      </Button>
    </>
  )
}

export const LoadingStatusAnnouncementError: Story = {render: LoadingStatusAnnouncementErrorStory}

export const LoadingStatusAnnouncementErrorInteractive: Story = {
  render: LoadingStatusAnnouncementErrorStory,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Export (error)'}))
    await expect(canvas.getByRole('heading', {name: 'Export failed'})).toBeInTheDocument()
  },
}
