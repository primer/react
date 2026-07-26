import {GrabberIcon, KebabHorizontalIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {TreeView} from './TreeView'

const meta = {
  title: 'React Tailwind/Navigation/TreeView/Examples',
  component: TreeView,
  decorators: [
    Story => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TreeView>
export default meta
type Story = StoryObj<typeof meta>

export const DraggableListItem: Story = {
  render: () => (
    <div>
      <TreeView aria-label="Issues">
        <TreeView.Item id="item-1" draggable>
          <TreeView.LeadingVisual label="Reorder item">
            <GrabberIcon />
          </TreeView.LeadingVisual>
          Item 1
        </TreeView.Item>
        <TreeView.Item id="item-2" draggable>
          <TreeView.LeadingVisual label="Reorder item">
            <GrabberIcon />
          </TreeView.LeadingVisual>
          Item 2
          <TreeView.SubTree>
            <TreeView.Item id="item-2-sub-task-1">sub task 1</TreeView.Item>
            <TreeView.Item id="item-2-sub-task-2">sub task 2</TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item id="item-3" draggable>
          <TreeView.LeadingVisual label="Reorder item">
            <GrabberIcon />
          </TreeView.LeadingVisual>
          Item 3
        </TreeView.Item>
      </TreeView>
    </div>
  ),
}
export const TrailingActions: Story = {
  render: () => (
    <div>
      <h2>Trailing Actions: Example with dialog</h2>
      <p>Press (Command + Shift + U) or (Control + Shift + U) to interact with the trailing action</p>
      <TreeView aria-label="Issues">
        <TreeView.Item id="item-1">Item 1</TreeView.Item>
        <TreeView.Item id="item-2">
          Item 2
          <TreeView.SubTree>
            <TreeView.Item id="item-2-sub-task-1">sub task 1</TreeView.Item>
            <TreeView.Item id="item-2-sub-task-2">sub task 2</TreeView.Item>
          </TreeView.SubTree>
          <TreeView.TrailingVisual label="Item settings">
            <KebabHorizontalIcon />
          </TreeView.TrailingVisual>
        </TreeView.Item>
        <TreeView.Item id="item-3">
          Item 3
          <TreeView.TrailingVisual label="Pull Requests">
            <KebabHorizontalIcon />
          </TreeView.TrailingVisual>
        </TreeView.Item>
      </TreeView>
    </div>
  ),
}
