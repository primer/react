import type {Meta, StoryObj} from '@storybook/react-vite'
import {Overlay} from './Overlay'

const meta = {
  title: 'React Tailwind/Components/Overlay',
  component: Overlay,
} satisfies Meta<typeof Overlay>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {render: () => <Overlay className="w-80 p-4">Floating content</Overlay>}
export const Playground: Story = {
  render: () => <Overlay className="w-96 p-6">Adjust this surface with className.</Overlay>,
}
export const Surface: Story = {
  render: () => <Overlay className="w-80 p-4">Overlay surfaces compose with positioning primitives.</Overlay>,
}
