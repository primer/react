import type {Meta, StoryObj} from '@storybook/react-vite'
import {InlineMessage} from './InlineMessage'

const meta = {
  title: 'React Tailwind/Content/InlineMessage/Features',
  component: InlineMessage,
} satisfies Meta<typeof InlineMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Critical: Story = {args: {variant: 'critical', children: 'An example inline message'}}
export const Success: Story = {args: {variant: 'success', children: 'An example inline message'}}
export const Unavailable: Story = {args: {variant: 'unavailable', children: 'An example inline message'}}
export const Warning: Story = {args: {variant: 'warning', children: 'An example inline message'}}

export const Multiline: Story = {
  render: () => (
    <div className="max-w-[30ch]">
      <InlineMessage variant="success">An example inline message that spans multiple lines</InlineMessage>
    </div>
  ),
}

export const Small: Story = {args: {size: 'small', variant: 'success', children: 'Small inline message'}}

export const CustomLeadingVisual: Story = {
  args: {variant: 'success', leadingVisual: <span aria-hidden="true">★</span>, children: 'Custom visual'},
}
