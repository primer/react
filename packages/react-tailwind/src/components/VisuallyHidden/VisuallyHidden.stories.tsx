import type {Meta, StoryObj} from '@storybook/react-vite'
import {VisuallyHidden} from './VisuallyHidden'

const meta = {
  title: 'React Tailwind/Display/VisuallyHidden',
  component: VisuallyHidden,
} satisfies Meta<typeof VisuallyHidden>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {children: 'Screen reader-only description'}}
