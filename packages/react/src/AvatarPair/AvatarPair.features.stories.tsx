import type {Meta} from '@storybook/react-vite'
import AvatarPair from './AvatarPair'
import Avatar from '../Avatar'

export default {
  title: 'Components/AvatarPair/Features',
  component: AvatarPair,
} as Meta<typeof AvatarPair>

export const ParentCircle = () => (
  <AvatarPair>
    <Avatar src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="Primer avatar, parent" />
    <Avatar square src="https://avatars.githubusercontent.com/primer" alt="Primer avatar, child" />
  </AvatarPair>
)

export const ParentSquare = () => (
  <AvatarPair>
    <Avatar square src="https://avatars.githubusercontent.com/primer" alt="Primer avatar, parent" />
    <Avatar src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="Primer avatar, child" />
  </AvatarPair>
)
