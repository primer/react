import type {Meta, StoryObj} from '@storybook/react-vite'
import {Avatar} from '../Avatar'
import {AvatarStack} from './AvatarStack'

const meta = {
  title: 'React Tailwind/Display/AvatarStack/Features',
  component: AvatarStack,
  args: {children: null},
} satisfies Meta<typeof AvatarStack>

export default meta
type Story = StoryObj<typeof meta>

export const AlignLeft: Story = {
  render: () => (
    <AvatarStack>
      <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
      <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
      <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
      <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/u/13171334?v=4" />
    </AvatarStack>
  ),
}

export const AlignRight: Story = {
  render: () => (
    <AvatarStack alignRight>
      <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
      <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
      <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
      <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/u/13171334?v=4" />
    </AvatarStack>
  ),
}

export const DisableExpandOnHover: Story = {
  render: () => (
    <AvatarStack disableExpand>
      <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
      <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
      <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
      <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/u/13171334?v=4" />
    </AvatarStack>
  ),
}

export const CustomSizeOnParent: Story = {
  render: () => (
    <AvatarStack size={32}>
      <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
      <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
      <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
      <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/u/13171334?v=4" />
    </AvatarStack>
  ),
}

export const CustomSizeOnParentResponsive: Story = {
  render: () => (
    <AvatarStack size={{narrow: 32, regular: 48, wide: 64}}>
      <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
      <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
      <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
      <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/u/13171334?v=4" />
    </AvatarStack>
  ),
}

export const CustomSizeOnChildren: Story = {
  render: () => (
    <AvatarStack>
      <Avatar size={20} alt="Primer logo" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
      <Avatar size={32} alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
      <Avatar size={48} alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
      <Avatar size={64} alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/u/13171334?v=4" />
    </AvatarStack>
  ),
}

export const WithSquareAvatars: Story = {
  render: () => (
    <AvatarStack shape="square">
      <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
      <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
      <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
      <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/u/13171334?v=4" />
    </AvatarStack>
  ),
}

export const CustomSizeOnChildrenResponsive: Story = {
  render: () => (
    <AvatarStack>
      <Avatar
        size={{narrow: 16, regular: 32, wide: 48}}
        alt="Primer logo"
        src="https://avatars.githubusercontent.com/u/7143434?v=4"
      />
      <Avatar
        size={{narrow: 32, regular: 48, wide: 64}}
        alt="GitHub logo"
        src="https://avatars.githubusercontent.com/github"
      />
      <Avatar
        size={{narrow: 48, regular: 64, wide: 96}}
        alt="Atom logo"
        src="https://avatars.githubusercontent.com/atom"
      />
      <Avatar
        size={{narrow: 64, regular: 96, wide: 120}}
        alt="GitHub Desktop logo"
        src="https://avatars.githubusercontent.com/u/13171334?v=4"
      />
    </AvatarStack>
  ),
}

export const WithSingleAvatar: Story = {
  render: () => (
    <AvatarStack>
      <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
    </AvatarStack>
  ),
}
