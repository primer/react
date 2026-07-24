import type {Meta, StoryObj} from '@storybook/react-vite'
import {SkeletonAvatar} from './SkeletonAvatar'

const meta = {
  title: 'React Tailwind/Display/SkeletonAvatar',
  component: SkeletonAvatar,
} satisfies Meta<typeof SkeletonAvatar>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {}}
export const Playground: Story = {args: {size: 'large', square: true}}
