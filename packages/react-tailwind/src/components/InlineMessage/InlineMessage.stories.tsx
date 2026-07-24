import type {Meta, StoryObj} from '@storybook/react-vite'
import {InlineMessage} from './InlineMessage'
const meta = {
  title: 'React Tailwind/Content/InlineMessage',
  component: InlineMessage,
  args: {children: 'Your changes were saved.'},
} satisfies Meta<typeof InlineMessage>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {variant: 'success', size: 'small'}}
