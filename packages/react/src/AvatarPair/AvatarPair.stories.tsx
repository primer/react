import type {Meta} from '@storybook/react-vite'
import AvatarPair from './AvatarPair'
import Avatar from '../Avatar'

export default {
  title: 'Components/AvatarPair',
  component: AvatarPair,
} as Meta<typeof AvatarPair>

export const Default = () => (
  <AvatarPair>
    <Avatar src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="Primer avatar, parent" />
    <Avatar src="https://avatars.githubusercontent.com/primer" alt="Primer avatar, child" />
  </AvatarPair>
)
