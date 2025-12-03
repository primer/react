import type {Meta} from '@storybook/react-vite'
import Avatar from './Avatar'

export default {
  title: 'Components/Avatar/Features',
  component: Avatar,
} as Meta<typeof Avatar>

export const Square = () => <Avatar square alt="primer" src="https://avatars.githubusercontent.com/primer" />

export const Size = () => (
  <div>
    <Avatar size={4} alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
    <Avatar size={8} alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
    <Avatar size={12} alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
    <Avatar size={16} alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
    <Avatar size={20} alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
    <Avatar size={24} alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
    <Avatar size={28} alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
    <Avatar size={32} alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
    <Avatar size={40} alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
    <Avatar size={48} alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
    <Avatar size={56} alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
    <Avatar size={64} alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
  </div>
)

export const SizeResponsive = () => (
  <div>
    <Avatar
      size={{narrow: 4, regular: 8, wide: 12}}
      alt="mona"
      src="https://avatars.githubusercontent.com/u/7143434?v=4"
    />
    <Avatar
      size={{narrow: 8, regular: 12, wide: 16}}
      alt="mona"
      src="https://avatars.githubusercontent.com/u/7143434?v=4"
    />
    <Avatar
      size={{narrow: 12, regular: 16, wide: 20}}
      alt="mona"
      src="https://avatars.githubusercontent.com/u/7143434?v=4"
    />
    <Avatar
      size={{narrow: 16, regular: 20, wide: 24}}
      alt="mona"
      src="https://avatars.githubusercontent.com/u/7143434?v=4"
    />
    <Avatar
      size={{narrow: 20, regular: 24, wide: 28}}
      alt="mona"
      src="https://avatars.githubusercontent.com/u/7143434?v=4"
    />
    <Avatar
      size={{narrow: 24, regular: 28, wide: 32}}
      alt="mona"
      src="https://avatars.githubusercontent.com/u/7143434?v=4"
    />
    <Avatar
      size={{narrow: 28, regular: 32, wide: 40}}
      alt="mona"
      src="https://avatars.githubusercontent.com/u/7143434?v=4"
    />
    <Avatar
      size={{narrow: 32, regular: 40, wide: 48}}
      alt="mona"
      src="https://avatars.githubusercontent.com/u/7143434?v=4"
    />
    <Avatar
      size={{narrow: 40, regular: 48, wide: 56}}
      alt="mona"
      src="https://avatars.githubusercontent.com/u/7143434?v=4"
    />
    <Avatar
      size={{narrow: 48, regular: 56, wide: 64}}
      alt="mona"
      src="https://avatars.githubusercontent.com/u/7143434?v=4"
    />
  </div>
)
