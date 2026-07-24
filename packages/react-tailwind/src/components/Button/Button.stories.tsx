import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from './Button'

const meta = {
  title: 'React Tailwind/Display/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {children: 'Button'}}
export const Playground: Story = {args: {children: 'Save changes', variant: 'primary', size: 'medium'}}
