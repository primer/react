import type {Meta, StoryObj} from '@storybook/react-vite'
import {InlineMessage} from './InlineMessage'

const meta = {
  title: 'React Tailwind/Content/InlineMessage/Examples',
  component: InlineMessage,
} satisfies Meta<typeof InlineMessage>

export default meta
type Story = StoryObj<typeof meta>

export const FormValidation: Story = {
  render: () => (
    <div className="space-y-3">
      <label className="block">
        Repository name
        <input className="mt-1 block border border-danger-emphasis" aria-invalid="true" />
      </label>
      <InlineMessage variant="critical" size="small">
        Repository name is already taken.
      </InlineMessage>
    </div>
  ),
}

export const WithLink: Story = {
  render: () => (
    <InlineMessage variant="warning">
      This action requires{' '}
      <a href="/" className="underline">
        administrator access
      </a>
      .
    </InlineMessage>
  ),
}

export const CustomContent: Story = {
  render: () => (
    <InlineMessage variant="success">
      <span className="font-semibold">Saved.</span> Your changes are now available to collaborators.
    </InlineMessage>
  ),
}
