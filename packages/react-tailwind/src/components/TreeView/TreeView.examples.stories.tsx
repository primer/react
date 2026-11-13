import {GearIcon, GitPullRequestIcon, GrabberIcon, IssueClosedIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import React from 'react'
import {action} from 'storybook/actions'
import {Dialog} from '../Dialog'
import {IconButton} from '../IconButton'
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

function DraggableItem({children, id}: {children: React.ReactNode; id: string}) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <TreeView.Item id={id} className="group/draggable" expanded={expanded} onExpandedChange={setExpanded}>
      <TreeView.LeadingAction>
        <IconButton
          icon={GrabberIcon}
          variant="invisible"
          aria-label="Reorder item"
          className="invisible group-hover/draggable:visible group-focus/draggable:visible"
          draggable="true"
          onDragStart={() => {
            setExpanded(false)
            // other drag logic to follow
          }}
        />
      </TreeView.LeadingAction>
      {children}
    </TreeView.Item>
  )
}

export const DraggableListItem: Story = {
  render: () => (
    <TreeView aria-label="Issues">
      <DraggableItem id="item-1">Item 1</DraggableItem>
      <DraggableItem id="item-2">
        Item 2
        <TreeView.SubTree>
          <TreeView.Item id="item-2-sub-task-1">sub task 1</TreeView.Item>
          <TreeView.Item id="item-2-sub-task-2">sub task 2</TreeView.Item>
        </TreeView.SubTree>
      </DraggableItem>
      <DraggableItem id="item-3">Item 3</DraggableItem>
    </TreeView>
  ),
}

function ItemWithActionDialog({children, id}: {children: React.ReactNode; id: string}) {
  const [expanded, setExpanded] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const openDialog = () => setDialogOpen(true)

  return (
    <>
      <TreeView.Item
        id={id}
        expanded={expanded}
        onExpandedChange={setExpanded}
        secondaryActions={[
          {label: 'Item settings', onClick: openDialog, icon: GearIcon},
          {label: 'Issues', onClick: openDialog, icon: IssueClosedIcon},
        ]}
      >
        {children}
      </TreeView.Item>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>My Dialog</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>Dialog that opens when the trailing action is clicked.</Dialog.Body>
        </Dialog.Content>
      </Dialog>
    </>
  )
}

export const TrailingActions: Story = {
  render: () => (
    <div>
      <h2>Trailing Actions: Example with dialog</h2>
      <p>Press (Command + Shift + U) or (Control + Shift + U) to interact with the trailing action</p>
      <TreeView aria-label="Issues">
        <TreeView.Item id="item-1">Item 1</TreeView.Item>
        <ItemWithActionDialog id="item-2">
          Item 2
          <TreeView.SubTree>
            <TreeView.Item id="item-2-sub-task-1">sub task 1</TreeView.Item>
            <TreeView.Item id="item-2-sub-task-2">sub task 2</TreeView.Item>
          </TreeView.SubTree>
        </ItemWithActionDialog>
        <TreeView.Item
          id="item-3"
          secondaryActions={[
            {label: 'Pull Requests', onClick: action('Pull Requests clicked'), icon: GitPullRequestIcon, count: 5},
          ]}
        >
          Item 3
        </TreeView.Item>
      </TreeView>
    </div>
  ),
}
