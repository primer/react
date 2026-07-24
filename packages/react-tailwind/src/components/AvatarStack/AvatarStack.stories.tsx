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
      <Avatar src="https://github.com/github.png" />
      <Avatar src="https://github.com/primer.png" />
    </AvatarStack>
  ),
}
export const Playground: Story = {args: {variant: 'stack', alignRight: true}}
