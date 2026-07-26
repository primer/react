import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {useState} from 'react'
import {Announce, AriaAlert, AriaStatus} from './LiveRegion'

const meta = {
  title: 'React Tailwind/Components/LiveRegion/Features',
  component: Announce,
} satisfies Meta<typeof Announce>

export default meta

type Story = StoryObj<typeof meta>

export const VisuallyHiddenStory: Story = {
  name: 'VisuallyHidden',
  render: () => (
    <>
      <p>This is an example</p>
      <div className="sr-only">
        <Announce>A visually hidden message</Announce>
        <AriaStatus>A visually hidden message</AriaStatus>
        <AriaAlert>A visually hidden message</AriaAlert>
      </div>
    </>
  ),
}

export const WithDelay: Story = {
  render: () => {
    const [message, setMessage] = useState('Default message')
    return (
      <>
        <button type="button" onClick={() => setMessage('Last updated at 10:49:13')}>
          Update message
        </button>
        <Announce delayMs={100}>{message}</Announce>
        <AriaStatus delayMs={100}>{message}</AriaStatus>
      </>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Update message'}))
    await expect(canvas.getAllByRole('status')).toHaveLength(2)
    await expect(canvas.getAllByRole('status')[0]).toHaveAttribute('aria-live', 'polite')
  },
}
