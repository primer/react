import type {Meta, StoryObj} from '@storybook/react-vite'
import {Link} from './Link'

const meta = {
  title: 'React Tailwind/Display/Link',
  component: Link,
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {children: 'Learn more', href: '#'}}
export const Playground: Story = {args: {children: 'Muted link', href: '#', muted: true}}
