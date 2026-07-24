import type {Meta, StoryObj} from '@storybook/react-vite'
import {Hidden} from './Hidden'

const meta = {
  title: 'Components/Hidden',
  component: Hidden,
} satisfies Meta<typeof Hidden>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'This content is hidden below the medium breakpoint.',
    when: 'narrow',
  },
}

export const Playground: Story = {
  args: {
    children: 'Resize the viewport to test the hidden range.',
    when: ['narrow', 'wide'],
  },
}
