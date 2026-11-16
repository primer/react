import type {Meta, StoryObj} from '@storybook/react-vite'
import {VisuallyHidden} from './VisuallyHidden'

const meta = {
  title: 'React Tailwind/Display/VisuallyHidden/Examples',
  component: VisuallyHidden,
} satisfies Meta<typeof VisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

export const IconOnlyControl: Story = {
  render: () => (
    <button type="button">
      <span aria-hidden="true">×</span>
      <VisuallyHidden>Close dialog</VisuallyHidden>
    </button>
  ),
}
