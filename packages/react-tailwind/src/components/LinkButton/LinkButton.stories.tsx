import type {Meta, StoryObj} from '@storybook/react-vite'
import {LinkButton} from './LinkButton'

const meta = {
  title: 'Components/React Tailwind/LinkButton',
  component: LinkButton,
  args: {
    children: 'View settings',
    href: '#',
  },
} satisfies Meta<typeof LinkButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Playground: Story = {}
