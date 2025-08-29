import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {SkeletonAvatar} from './SkeletonAvatar'
import AvatarStack from '../AvatarStack'

export default {
  title: 'Components/Skeleton/SkeletonAvatar/Features',
  component: SkeletonAvatar,
} as Meta<ComponentProps<typeof SkeletonAvatar>>

export const Square = () => <SkeletonAvatar square />

export const Size = () => (
  <div>
    <SkeletonAvatar size={4} />
    <SkeletonAvatar size={8} />
    <SkeletonAvatar size={12} />
    <SkeletonAvatar size={16} />
    <SkeletonAvatar size={20} />
    <SkeletonAvatar size={24} />
    <SkeletonAvatar size={28} />
    <SkeletonAvatar size={32} />
    <SkeletonAvatar size={40} />
    <SkeletonAvatar size={48} />
    <SkeletonAvatar size={56} />
    <SkeletonAvatar size={64} />
  </div>
)

export const SizeResponsive = () => (
  <div>
    <SkeletonAvatar size={{narrow: 4, regular: 8, wide: 12}} />
    <SkeletonAvatar size={{narrow: 8, regular: 12, wide: 16}} />
    <SkeletonAvatar size={{narrow: 12, regular: 16, wide: 20}} />
    <SkeletonAvatar size={{narrow: 16, regular: 20, wide: 24}} />
    <SkeletonAvatar size={{narrow: 20, regular: 24, wide: 28}} />
    <SkeletonAvatar size={{narrow: 24, regular: 28, wide: 32}} />
    <SkeletonAvatar size={{narrow: 28, regular: 32, wide: 40}} />
    <SkeletonAvatar size={{narrow: 32, regular: 40, wide: 48}} />
    <SkeletonAvatar size={{narrow: 40, regular: 48, wide: 56}} />
    <SkeletonAvatar size={{narrow: 48, regular: 56, wide: 64}} />
  </div>
)

export const InAStack = () => (
  <AvatarStack>
    <SkeletonAvatar />
    <SkeletonAvatar />
    <SkeletonAvatar />
    <SkeletonAvatar />
  </AvatarStack>
)
