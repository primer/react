import type {Meta, StoryObj} from '@storybook/react-vite'
import {CounterLabel} from './CounterLabel'

const meta = {title: 'React Tailwind/Display/CounterLabel/Features', component: CounterLabel} satisfies Meta<
  typeof CounterLabel
>
export default meta
type Story = StoryObj<typeof meta>
export const PrimaryTheme: Story = {args: {variant: 'primary', children: 12}}
export const SecondaryTheme: Story = {args: {variant: 'secondary', children: 12}}
