import type {Meta, StoryObj} from '@storybook/react-vite'
import {VisuallyHidden} from '../VisuallyHidden'
import {AriaStatus} from './LiveRegion'
import {useTickingMessage} from './LiveRegion.storyHelpers'

const meta = {
  title: 'React Tailwind/Components/AriaStatus/Features',
  component: AriaStatus,
} satisfies Meta<typeof AriaStatus>

export default meta

type Story = StoryObj<typeof meta>

export const VisuallyHiddenStory: Story = {
  name: 'VisuallyHidden',
  render: () => (
    <>
      <p>This is an example</p>
      <VisuallyHidden>
        <AriaStatus>A visually hidden message</AriaStatus>
      </VisuallyHidden>
    </>
  ),
}

export const WithDelay: Story = {
  render: function Render() {
    const message = useTickingMessage()
    return <AriaStatus delayMs={1000}>{message}</AriaStatus>
  },
}
