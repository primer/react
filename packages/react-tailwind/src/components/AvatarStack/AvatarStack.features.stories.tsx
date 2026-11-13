import type {Meta, StoryObj} from '@storybook/react-vite'
import type {ComponentProps} from 'react'
import {Avatar} from '../Avatar'
import {Link} from '../Link'
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

const fixtureAvatar =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16"%3E%3Crect width="16" height="16" fill="%237893ab"/%3E%3C/svg%3E'
const fixtureTeam =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16"%3E%3Crect width="16" height="16" fill="%23bd774e"/%3E%3C/svg%3E'

function ForwardingAvatar(props: ComponentProps<typeof Avatar>) {
  return <Avatar {...props} />
}

function TeamAvatar(props: ComponentProps<typeof Avatar>) {
  return <Avatar {...props} square />
}

function EntityAvatar({
  avatarSize,
  entity,
  ...props
}: ComponentProps<typeof Avatar> & {avatarSize?: number; entity: 'person' | 'team' | 'app'}) {
  return <Avatar size={avatarSize} square={entity !== 'person'} {...props} />
}

export const MixedAvatarShapes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div>
        <div>Direct avatars, square first</div>
        <AvatarStack size={16} disableExpand data-testid="direct-square-first">
          <Avatar square alt="Direct team first" src={fixtureTeam} />
          <Avatar alt="Direct person second" src={fixtureAvatar} />
        </AvatarStack>
      </div>
      <div>
        <div>Direct avatars, square second</div>
        <AvatarStack size={16} disableExpand data-testid="direct-square-second">
          <Avatar alt="Direct person first" src={fixtureAvatar} />
          <Avatar square alt="Direct team second" src={fixtureTeam} />
        </AvatarStack>
      </div>
      <div>
        <div>Forwarding wrappers, square first</div>
        <AvatarStack shape="circle" size={16} disableExpand data-testid="wrapped-square-first">
          <ForwardingAvatar square alt="Wrapped team first" src={fixtureTeam} />
          <ForwardingAvatar alt="Wrapped person second" src={fixtureAvatar} />
        </AvatarStack>
      </div>
      <div>
        <div>Forwarding wrappers, square second</div>
        <AvatarStack size={16} disableExpand data-testid="wrapped-square-second">
          <ForwardingAvatar alt="Wrapped person first" src={fixtureAvatar} />
          <ForwardingAvatar square alt="Wrapped team second" src={fixtureTeam} />
        </AvatarStack>
      </div>
      <div>
        <div>Wrapper chooses its own square shape</div>
        <AvatarStack size={16} disableExpand data-testid="wrapper-default-shape">
          <Avatar alt="Person before default team" src={fixtureAvatar} />
          <TeamAvatar alt="Team with wrapper default" src={fixtureTeam} />
        </AvatarStack>
      </div>
      <div>
        <div>Wrapper defaults before forwarding stack props</div>
        <AvatarStack disableExpand data-testid="wrapper-forwarded-defaults">
          <EntityAvatar avatarSize={16} entity="team" alt="Wrapper team first" src={fixtureTeam} />
          <EntityAvatar avatarSize={16} entity="person" alt="Wrapper person" src={fixtureAvatar} />
          <EntityAvatar avatarSize={16} entity="app" alt="Wrapper app last" src={fixtureTeam} />
        </AvatarStack>
      </div>
      <div>
        <div>Wrapper defaults with a square stack and explicit size</div>
        <AvatarStack shape="square" size={16} disableExpand data-testid="wrapper-stack-override">
          <EntityAvatar avatarSize={16} entity="team" alt="Square stack team first" src={fixtureTeam} />
          <EntityAvatar avatarSize={16} entity="person" alt="Square stack person" src={fixtureAvatar} />
          <EntityAvatar avatarSize={16} entity="app" alt="Square stack app last" src={fixtureTeam} />
        </AvatarStack>
      </div>
      <div>
        <div>Square stack overrides child circles</div>
        <AvatarStack shape="square" size={16} disableExpand data-testid="square-stack">
          <Avatar square={false} shape="circle" alt="Direct stack override" src={fixtureAvatar} />
          <ForwardingAvatar square={false} shape="circle" alt="Wrapped stack override" src={fixtureAvatar} />
        </AvatarStack>
      </div>
      <div>
        <div>Linked square and circular avatars</div>
        <AvatarStack size={16} disableExpand data-testid="linked-shapes">
          <Link href="#team" aria-label="Team profile">
            <Avatar square alt="" src={fixtureTeam} />
          </Link>
          <Link href="#person" aria-label="Person profile">
            <Avatar alt="" src={fixtureAvatar} />
          </Link>
        </AvatarStack>
      </div>
      <div>
        <div>Square shape prop and custom wrapper rounding</div>
        <AvatarStack size={16} disableExpand data-testid="custom-shapes">
          <Link href="#shaped-team" aria-label="Team with shape prop">
            <Avatar shape="square" alt="" src={fixtureTeam} />
          </Link>
          <Link href="#custom-person" aria-label="Person with custom wrapper shape" className="rounded-none">
            <Avatar alt="" src={fixtureAvatar} />
          </Link>
        </AvatarStack>
      </div>
      <div>
        <div>Plain image children</div>
        <AvatarStack size={16} disableExpand data-testid="plain-images">
          <img alt="Plain person first" src={fixtureAvatar} />
          <img alt="Plain person second" src={fixtureAvatar} />
        </AvatarStack>
      </div>
    </div>
  ),
}

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
