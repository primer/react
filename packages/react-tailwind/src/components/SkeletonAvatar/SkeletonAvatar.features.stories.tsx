import type {Meta, StoryObj} from '@storybook/react-vite'
import {AvatarStack} from '../AvatarStack'
import {SkeletonAvatar} from './SkeletonAvatar'

const meta = {
  title: 'React Tailwind/Display/SkeletonAvatar/Features',
  component: SkeletonAvatar,
} satisfies Meta<typeof SkeletonAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Square: Story = {args: {square: true}}

export const Size: Story = {
  render: () => (
    <div>
      {[4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64].map(size => (
        <SkeletonAvatar key={size} size={size} />
      ))}
    </div>
  ),
}

export const SizeResponsive: Story = {
  render: () => (
    <div>
      {[
        [4, 8, 12],
        [8, 12, 16],
        [12, 16, 20],
        [16, 20, 24],
        [20, 24, 28],
        [24, 28, 32],
        [28, 32, 40],
        [32, 40, 48],
        [40, 48, 56],
        [48, 56, 64],
      ].map(([narrow, regular, wide]) => (
        <SkeletonAvatar key={`${narrow}-${regular}-${wide}`} size={{narrow, regular, wide}} />
      ))}
    </div>
  ),
}

export const InAStack: Story = {
  render: () => (
    <AvatarStack>
      <SkeletonAvatar />
      <SkeletonAvatar />
      <SkeletonAvatar />
      <SkeletonAvatar />
    </AvatarStack>
  ),
}

export const NumericSize: Story = {args: {size: 56}}
