import type {Meta, StoryObj} from '@storybook/react-vite'
import {Link} from './Link'

const meta = {
  title: 'React Tailwind/Display/Link',
  component: Link,
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {children: 'Links are great', href: '#'}}
export const Playground: Story = {args: {children: 'Link', href: '#', muted: false, inline: false}}
