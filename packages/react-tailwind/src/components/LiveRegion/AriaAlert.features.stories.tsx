import type {Meta, StoryObj} from '@storybook/react-vite'
import {VisuallyHidden} from '../VisuallyHidden'
import {AriaAlert} from './LiveRegion'

const meta = {
  title: 'React Tailwind/Components/AriaAlert/Features',
  component: AriaAlert,
} satisfies Meta<typeof AriaAlert>

export default meta

type Story = StoryObj<typeof meta>

export const VisuallyHiddenStory: Story = {
  name: 'VisuallyHidden',
  render: () => (
    <>
      <p>This is an example</p>
      <VisuallyHidden>
        <AriaAlert>A visually hidden message</AriaAlert>
      </VisuallyHidden>
    </>
  ),
}
