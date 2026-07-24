import type {Meta, StoryObj} from '@storybook/react-vite'
import {Avatar} from './Avatar'

const meta = {
  title: 'React Tailwind/Display/Avatar',
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {src: 'https://avatars.githubusercontent.com/u/7143434?v=4'}}
export const Playground: Story = {
  args: {src: 'https://avatars.githubusercontent.com/u/7143434?v=4', alt: 'mona', size: 32, square: false},
}
