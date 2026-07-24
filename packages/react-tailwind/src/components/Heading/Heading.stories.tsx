import type {Meta, StoryObj} from '@storybook/react-vite'
import {Heading} from './Heading'

const meta = {
  title: 'React Tailwind/Display/Heading',
  component: Heading,
} satisfies Meta<typeof Heading>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {children: 'Heading'}}
export const Playground: Story = {args: {children: 'Large heading', as: 'h1', size: 'large'}}
