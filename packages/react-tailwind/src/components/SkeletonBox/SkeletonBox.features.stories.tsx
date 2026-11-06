import type {Meta, StoryObj} from '@storybook/react-vite'
import {SkeletonBox} from './SkeletonBox'

const meta = {
  title: 'React Tailwind/Display/SkeletonBox/Features',
  component: SkeletonBox,
} satisfies Meta<typeof SkeletonBox>

export default meta
type Story = StoryObj<typeof meta>

export const CustomHeight: Story = {args: {height: '4rem'}}
export const CustomWidth: Story = {args: {width: '300px'}}
export const WithDelay: Story = {args: {delay: 'long'}}

export const CustomElement: Story = {
  render: () => <SkeletonBox as="span" width="12rem" height="1rem" />,
}

export const ReducedMotion: Story = {
  parameters: {chromatic: {disable: true}},
  render: () => <SkeletonBox aria-label="Loading content" />,
}
