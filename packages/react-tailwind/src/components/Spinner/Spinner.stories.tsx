import type {Meta, StoryObj} from '@storybook/react-vite'
import {Spinner} from './Spinner'

const meta = {
  title: 'React Tailwind/Display/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {}}
export const Playground: Story = {args: {size: 'large', srText: 'Loading results'}}
