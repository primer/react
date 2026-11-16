import type {Meta, StoryObj} from '@storybook/react-vite'
import {StateLabel} from './StateLabel'

const meta = {
  title: 'React Tailwind/Display/StateLabel/Examples',
  component: StateLabel,
  args: {children: 'Open', status: 'issueOpened'},
} satisfies Meta<typeof StateLabel>

export default meta
type Story = StoryObj<typeof meta>

export const PullRequestState: Story = {
  render: () => <StateLabel status="pullMerged">Merged</StateLabel>,
}
