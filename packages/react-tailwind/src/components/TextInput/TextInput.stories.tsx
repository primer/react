import type {Meta, StoryObj} from '@storybook/react-vite'
import {TextInput} from './TextInput'
const meta = {
  title: 'React Tailwind/Forms/TextInput',
  component: TextInput,
} satisfies Meta<typeof TextInput>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {placeholder: 'Repository name'}}
export const Playground: Story = {args: {size: 'medium', disabled: false, placeholder: 'primer/react'}}
