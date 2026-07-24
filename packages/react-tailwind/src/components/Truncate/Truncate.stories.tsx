import type {Meta, StoryObj} from '@storybook/react-vite'
import {Truncate} from './Truncate'

const meta = {
  title: 'React Tailwind/Display/Truncate',
  component: Truncate,
} satisfies Meta<typeof Truncate>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  args: {children: 'Some example text', title: 'Some example text'},
}
export const Playground: Story = {
  args: {
    children: 'Some example text',
    title: 'Some example text',
    inline: false,
    maxWidth: 125,
  },
}
