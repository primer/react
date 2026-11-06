import type {Meta, StoryObj} from '@storybook/react-vite'
import {Avatar} from '../Avatar'
import {AvatarStack} from './AvatarStack'

const meta = {
  title: 'React Tailwind/Display/AvatarStack',
  component: AvatarStack,
  args: {children: null},
  argTypes: {
    children: {control: false},
    alignRight: {control: 'boolean'},
    disableExpand: {control: 'boolean'},
    shape: {control: 'radio', options: ['circle', 'square']},
    size: {control: 'object'},
    variant: {control: 'radio', options: ['cascade', 'stack']},
  },
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

export const Playground: Story = {
  render: ({children: _children, ...args}) => (
    <AvatarStack {...args}>
      <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/u/7143434?v=4" />
      <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
      <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
      <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/u/13171334?v=4" />
    </AvatarStack>
  ),
}
