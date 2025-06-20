import type {Meta} from '@storybook/react-vite'
import AvatarStack from './AvatarStack'
import Avatar from '../Avatar'
import Link from '../Link'

export default {
  title: 'Components/AvatarStack/Dev',
  component: AvatarStack,
} as Meta<typeof AvatarStack>

export const SxProp = () => (
  <AvatarStack
    alignRight
    sx={{
      backgroundColor: 'red',
    }}
  >
    <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
    <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
    <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
    <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
  </AvatarStack>
)

export const WithLinkWrappers = () => (
  <AvatarStack>
    <Link aria-label="Primer is assigned" href="#" className="pc-AvatarItem" data-hovercard-url="/primer">
      <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
    </Link>
    <Link aria-label="GitHub is assigned" href="#" className="pc-AvatarItem" data-hovercard-url="/primer">
      <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
    </Link>
    <Link aria-label="Atom is assigned" href="#" className="pc-AvatarItem" data-hovercard-url="/primer">
      <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
    </Link>
    <Link aria-label="GitHub Desktop is assigned" href="#" className="pc-AvatarItem" data-hovercard-url="/primer">
      <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
    </Link>
  </AvatarStack>
)
