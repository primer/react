import type {Meta, StoryObj} from '@storybook/react-vite'
import {AvatarStack} from './AvatarStack'
import {Avatar} from '../Avatar'

const meta = {
  title: 'React Tailwind/Display/AvatarStack',
  component: AvatarStack,
} satisfies Meta<typeof AvatarStack>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <AvatarStack>
      <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
      <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
      <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
      <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/u/13171334?v=4" />
    </AvatarStack>
  ),
}
export const Playground: Story = {args: {variant: 'stack', alignRight: true}}
