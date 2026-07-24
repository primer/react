import {PlusIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {IconButton} from './IconButton'

const meta = {
  title: 'Components/React Tailwind/IconButton',
  component: IconButton,
  args: {
    'aria-label': 'Add item',
    icon: PlusIcon,
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Playground: Story = {}
