import type {Meta, StoryObj} from '@storybook/react-vite'
import {Avatar} from '../Avatar'
import {Link} from '../Link'
import {AvatarStack} from './AvatarStack'

const meta = {
  title: 'React Tailwind/Display/AvatarStack/Dev',
  component: AvatarStack,
  args: {children: null},
} satisfies Meta<typeof AvatarStack>

export default meta
type Story = StoryObj<typeof meta>

export const WithLinkWrappers: Story = {
  render: () => (
    <AvatarStack>
      <Link aria-label="Primer is assigned" href="#" data-hovercard-url="/primer">
        <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
      </Link>
      <Link aria-label="GitHub is assigned" href="#" data-hovercard-url="/primer">
        <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
      </Link>
      <Link aria-label="Atom is assigned" href="#" data-hovercard-url="/primer">
        <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
      </Link>
      <Link aria-label="GitHub Desktop is assigned" href="#" data-hovercard-url="/primer">
        <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/u/13171334?v=4" />
      </Link>
    </AvatarStack>
  ),
}
