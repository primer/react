import type {Meta, StoryObj} from '@storybook/react-vite'
import {InfoIcon, ShieldLockIcon} from '@primer/octicons-react'
import {memo} from 'react'
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

const MemoShieldIcon = memo(ShieldLockIcon)

export const ComponentLeadingVisuals: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <InlineMessage data-testid="forward-ref-visual" leadingVisual={InfoIcon}>
        A forwardRef information icon
      </InlineMessage>
      <InlineMessage data-testid="memo-visual" leadingVisual={MemoShieldIcon}>
        A memo security icon
      </InlineMessage>
      <InlineMessage
        data-testid="element-visual"
        leadingVisual={<ShieldLockIcon aria-hidden="true" className="consumer-icon" size={24} />}
      >
        An already-rendered security icon
      </InlineMessage>
      <InlineMessage data-testid="node-visual" leadingVisual={<span aria-hidden="true">!</span>}>
        A rendered text visual
      </InlineMessage>
    </div>
  ),
}
