import type {Meta, StoryObj} from '@storybook/react-vite'
import {Textarea} from './Textarea'
const meta = {
  title: 'React Tailwind/Forms/Textarea',
  component: Textarea,
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {placeholder: ''}}
export const Playground: Story = {
  args: {'aria-label': 'Description', resize: 'vertical', rows: 4, disabled: false},
}
