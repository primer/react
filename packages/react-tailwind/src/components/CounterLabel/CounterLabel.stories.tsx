import type {Meta, StoryObj} from '@storybook/react-vite'
import {CounterLabel} from './CounterLabel'

const meta = {
  title: 'React Tailwind/Display/CounterLabel',
  component: CounterLabel,
} satisfies Meta<typeof CounterLabel>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {children: 12}}
export const Playground: Story = {args: {children: 99, variant: 'primary'}}
