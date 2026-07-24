import type {Meta, StoryObj} from '@storybook/react-vite'
import {InlineMessage} from './InlineMessage'
const meta = {
  title: 'Content/InlineMessage',
  component: InlineMessage,
  args: {children: 'Your changes were saved.'},
} satisfies Meta<typeof InlineMessage>
export default meta
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {variant: 'success', size: 'small'}}
