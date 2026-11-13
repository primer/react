import type {Meta, StoryObj} from '@storybook/react-vite'
import {LabelGroup} from './LabelGroup'

const meta = {
  title: 'React Tailwind/Display/LabelGroup/Examples',
  component: LabelGroup,
} satisfies Meta<typeof LabelGroup>

export default meta
type Story = StoryObj<typeof meta>

export const FilterSummary: Story = {
  render: () => (
    <LabelGroup aria-label="Active filters">
      <span className="rounded-full border-thin px-2 py-1 text-xs">is:open</span>
      <span className="rounded-full border-thin px-2 py-1 text-xs">author:octocat</span>
    </LabelGroup>
  ),
}
