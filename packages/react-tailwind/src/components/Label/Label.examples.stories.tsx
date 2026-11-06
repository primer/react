import type {Meta, StoryObj} from '@storybook/react-vite'
import {Label} from './Label'

const meta = {
  title: 'React Tailwind/Display/Label/Examples',
  component: Label,
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const IssueMetadata: Story = {
  render: () => (
    <div className="flex gap-2">
      <Label variant="success">ready for review</Label>
      <Label variant="attention">needs triage</Label>
    </div>
  ),
}
