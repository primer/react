import type {Meta, StoryObj} from '@storybook/react-vite'
import {Avatar} from './Avatar'

const meta = {
  title: 'React Tailwind/Display/Avatar',
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {src: 'https://github.com/github.png', alt: 'GitHub'}}
export const Playground: Story = {
  args: {src: 'https://github.com/github.png', alt: 'GitHub', size: 'large', square: true},
}
