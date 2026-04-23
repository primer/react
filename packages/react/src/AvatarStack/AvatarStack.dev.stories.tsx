import type {Meta} from '@storybook/react-vite'
import AvatarStack from './AvatarStack'
import Avatar from '../Avatar'
import Link from '../Link'

export default {
  title: 'Components/AvatarStack/Dev',
  component: AvatarStack,
} as Meta<typeof AvatarStack>

export const WithLinkWrappers = () => (
  <AvatarStack>
    <Link aria-label="Primer is assigned" href="#" className="pc-AvatarItem" data-hovercard-url="/primer">
      <Avatar alt="Primer logo" src="/avatars/primer.png" />
    </Link>
    <Link aria-label="GitHub is assigned" href="#" className="pc-AvatarItem" data-hovercard-url="/primer">
      <Avatar alt="GitHub logo" src="/avatars/github.png" />
    </Link>
    <Link aria-label="Atom is assigned" href="#" className="pc-AvatarItem" data-hovercard-url="/primer">
      <Avatar alt="Atom logo" src="/avatars/atom.png" />
    </Link>
    <Link aria-label="GitHub Desktop is assigned" href="#" className="pc-AvatarItem" data-hovercard-url="/primer">
      <Avatar alt="GitHub Desktop logo" src="/avatars/desktop.png" />
    </Link>
  </AvatarStack>
)
