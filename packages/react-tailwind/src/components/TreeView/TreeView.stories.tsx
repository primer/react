import type {Meta, StoryObj} from '@storybook/react-vite'
import {TreeView} from './TreeView'
const meta = {
  title: 'React Tailwind/Navigation/TreeView',
  component: TreeView,
} satisfies Meta<typeof TreeView>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <TreeView aria-label="Files">
      <TreeView.Item id="src" defaultExpanded subtree={<TreeView.Item id="main">main.tsx</TreeView.Item>}>
        src
      </TreeView.Item>
      <TreeView.Item id="readme">README.md</TreeView.Item>
    </TreeView>
  ),
}
