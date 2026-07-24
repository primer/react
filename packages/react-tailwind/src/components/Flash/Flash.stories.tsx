import type {Meta, StoryObj} from '@storybook/react-vite'
import {Flash} from './Flash'
const meta = {
  title: 'React Tailwind/Content/Flash',
  component: Flash,
  args: {children: 'Default'},
} satisfies Meta<typeof Flash>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {variant: 'default'}}
