import type {Meta, StoryObj} from '@storybook/react-vite'
import {SkeletonText} from './SkeletonText'

const meta = {
  title: 'React Tailwind/Display/SkeletonText',
  component: SkeletonText,
} satisfies Meta<typeof SkeletonText>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {}}
export const Playground: Story = {args: {size: 'bodyMedium', lines: 1}}
