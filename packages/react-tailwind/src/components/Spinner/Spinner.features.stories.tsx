import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Spinner} from './Spinner'

const meta = {
  title: 'React Tailwind/Display/Spinner/Features',
  component: Spinner,
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {args: {size: 'small'}}
export const Large: Story = {args: {size: 'large'}}

export const SuppressScreenReaderText: Story = {
  render: () => (
    <div className="flex items-center gap-1">
      <Spinner size="small" srText={null} />
      <span role="status">Loading...</span>
    </div>
  ),
}

export const WithDelay: Story = {args: {delay: 'long'}}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="small" />
      <Spinner size="medium" />
      <Spinner size="large" />
    </div>
  ),
}

export const ReducedMotion: Story = {
  parameters: {chromatic: {disable: true}},
  render: () => <Spinner aria-label="Loading with reduced motion support" />,
}

export const LoadingTrigger: Story = {
  render: function LoadingTriggerStory() {
    const [loading, setLoading] = useState(false)
    return (
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setLoading(true)} disabled={loading}>
          Load content
        </button>
        {loading ? <Spinner size="small" /> : <span>Ready</span>}
      </div>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Load content'}))
    await expect(canvas.getByRole('status')).toBeInTheDocument()
  },
}
