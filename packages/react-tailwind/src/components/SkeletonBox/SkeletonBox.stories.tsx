import type {Meta, StoryObj} from '@storybook/react-vite'
import {SkeletonBox} from './SkeletonBox'

const meta = {
  title: 'React Tailwind/Display/SkeletonBox',
  component: SkeletonBox,
} satisfies Meta<typeof SkeletonBox>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {width: 160, height: 24}}
export const Playground: Story = {args: {width: 240, height: 48, delay: 'short'}}
