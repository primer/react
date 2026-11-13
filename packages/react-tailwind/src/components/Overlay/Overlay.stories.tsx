import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {Overlay} from './Overlay'

const meta = {
  title: 'React Tailwind/Components/Overlay',
  component: Overlay,
  args: {
    'aria-label': 'Example overlay',
    className: 'w-96 p-6',
    role: 'dialog',
  },
  argTypes: {
    'aria-label': {control: 'text'},
    className: {control: 'text'},
    role: {control: 'select', options: ['dialog', 'menu', 'region']},
  },
} satisfies Meta<typeof Overlay>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Overlay className="w-80 p-4">Floating content</Overlay>,
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByText('Floating content')).toBeVisible()
  },
}
export const Playground: Story = {
  render: args => <Overlay {...args}>Adjust this surface with className.</Overlay>,
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByText('Adjust this surface with className.')).toBeVisible()
  },
}
export const Surface: Story = {
  render: () => <Overlay className="w-80 p-4">Overlay surfaces compose with positioning primitives.</Overlay>,
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByText('Overlay surfaces compose with positioning primitives.')).toBeVisible()
  },
}
