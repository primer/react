import type {Meta, StoryObj} from '@storybook/react-vite'
import {VisuallyHidden} from '../VisuallyHidden'
import {Announce} from './LiveRegion'
import {useTickingMessage} from './LiveRegion.storyHelpers'

const meta = {
  title: 'React Tailwind/Components/Announce/Features',
  component: Announce,
} satisfies Meta<typeof Announce>

export default meta

type Story = StoryObj<typeof meta>

export const VisuallyHiddenStory: Story = {
  name: 'VisuallyHidden',
  render: () => (
    <>
      <p>This is an example</p>
      <VisuallyHidden>
        <Announce>A visually hidden message</Announce>
      </VisuallyHidden>
    </>
  ),
}

export const WithDelay: Story = {
  render: function Render() {
    const message = useTickingMessage()
    return <Announce delayMs={1000}>{message}</Announce>
  },
}
