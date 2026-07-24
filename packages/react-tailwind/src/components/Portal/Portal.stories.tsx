import type {Meta, StoryObj} from '@storybook/react-vite'
import {Portal} from './Portal'

const meta = {
  title: 'React Tailwind/Components/Portal',
  component: Portal,
} satisfies Meta<typeof Portal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <span className="text-default">This content is rendered at the end of the document body.</span>,
  },
}

export const Playground: Story = {
  args: {
    children: <span className="text-default">Portaled content</span>,
  },
}
