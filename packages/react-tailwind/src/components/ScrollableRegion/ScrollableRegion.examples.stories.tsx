import type {Meta, StoryObj} from '@storybook/react-vite'
import {ScrollableRegion} from './ScrollableRegion'

const meta = {
  title: 'React Tailwind/Components/ScrollableRegion/Examples',
  component: ScrollableRegion,
  args: {'aria-label': 'Scrollable example'},
} satisfies Meta<typeof ScrollableRegion>
export default meta
type Story = StoryObj<typeof meta>

export const CommitSummary: Story = {
  render: () => (
    <ScrollableRegion aria-label="Commit summary" className="max-w-lg">
      <pre className="m-0 min-w-[45rem] bg-muted p-4 font-mono">
        {`9c4f1aa  Update release notes
3f12b0d  Fix keyboard focus in navigation
e7a8d21  Add responsive settings layout
0f39c2a  Refresh dependency metadata`}
      </pre>
    </ScrollableRegion>
  ),
}
