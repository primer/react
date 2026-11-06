import type {Meta, StoryObj} from '@storybook/react-vite'
import {IssueLabelToken} from './IssueLabelToken'
import {Token} from './Token'

const meta = {
  title: 'React Tailwind/Content/Token/Examples',
  component: Token,
  args: {text: 'token'},
} satisfies Meta<typeof Token>

export default meta
type Story = StoryObj<typeof meta>

export const FilterChips: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Token text="documentation" isSelected />
      <Token text="good first issue" />
      <Token text="help wanted" />
    </div>
  ),
}

export const RemovableFilters: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Token text="language:typescript" onRemove={() => {}} />
      <Token text="is:open" onRemove={() => {}} />
      <IssueLabelToken text="bug" fillColor="#d73a4a" onRemove={() => {}} />
    </div>
  ),
}

export const LongTokenContent: Story = {
  render: () => <Token text="a very long token label that should remain within its container" className="max-w-48" />,
}
