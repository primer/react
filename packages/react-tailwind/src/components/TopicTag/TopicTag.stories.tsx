import type {Meta, StoryObj} from '@storybook/react-vite'
import {TopicTag} from './TopicTag'
const meta = {
  title: 'React Tailwind/Content/TopicTag',
  component: TopicTag,
  args: {children: 'react', href: '#react'},
} satisfies Meta<typeof TopicTag>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {as: 'button'}}
