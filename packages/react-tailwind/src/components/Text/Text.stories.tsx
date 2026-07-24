import type {Meta, StoryObj} from '@storybook/react-vite'
import {Text} from './Text'

const meta = {
  title: 'React Tailwind/Display/Text',
  component: Text,
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {children: 'Body text'}}
export const Playground: Story = {args: {children: 'Large semibold text', size: 'large', weight: 'semibold'}}
