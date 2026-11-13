import type {Meta, StoryObj} from '@storybook/react-vite'
import {BranchName} from './BranchName'

const meta = {
  title: 'React Tailwind/Display/BranchName/Examples',
  component: BranchName,
} satisfies Meta<typeof BranchName>

export default meta
type Story = StoryObj<typeof meta>

export const PullRequestBranch: Story = {
  render: () => <BranchName href="#branch">feature/improve-documentation</BranchName>,
}
