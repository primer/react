import type {Meta, StoryObj} from '@storybook/react-vite'
import {Truncate} from './Truncate'

const meta = {
  title: 'React Tailwind/Display/Truncate',
  component: Truncate,
} satisfies Meta<typeof Truncate>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  args: {children: 'A long branch name that truncates', title: 'A long branch name that truncates'},
}
export const Playground: Story = {
  args: {
    children: 'A long branch name that truncates',
    title: 'A long branch name that truncates',
    inline: true,
    maxWidth: 180,
  },
}
