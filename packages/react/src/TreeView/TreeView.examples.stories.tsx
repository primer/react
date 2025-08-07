import {GrabberIcon, GearIcon} from '@primer/octicons-react'
import type {StoryFn, Meta} from '@storybook/react-vite'
import React from 'react'
import Box from '../Box'
import {TreeView} from './TreeView'
import {IconButton} from '../Button'
import {Dialog} from '../Dialog/Dialog'

const meta: Meta = {
  title: 'Components/TreeView/Examples',
  component: TreeView,
  decorators: [
    Story => {
      return (
        // Prevent TreeView from expanding to the full width of the screen
        <Box sx={{maxWidth: 400}}>
          <Story />
        </Box>
      )
    },
  ],
}

export const DraggableListItem: StoryFn = () => {
  return (
    <Box
      sx={{
        // using Box for css, this could be in a css file as well
        '.treeview-item': {
          '.treeview-leading-action': {visibility: 'hidden'},
          '&:hover, &:focus': {
            '.treeview-leading-action': {visibility: 'visible'},
          },
        },
      }}
    >
      <TreeView aria-label="Issues">
        <ControlledDraggableItem id="item-1">Item 1</ControlledDraggableItem>
        <ControlledDraggableItem id="item-2">
          Item 2
          <TreeView.SubTree>
            <TreeView.Item id="item-2-sub-task-1">sub task 1</TreeView.Item>
            <TreeView.Item id="item-2-sub-task-2">sub task 2</TreeView.Item>
          </TreeView.SubTree>
        </ControlledDraggableItem>
        <ControlledDraggableItem id="item-3">Item 3</ControlledDraggableItem>
      </TreeView>
    </Box>
  )
}

const ControlledDraggableItem: React.FC<{id: string; children: React.ReactNode}> = ({id, children}) => {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <>
      <TreeView.Item id={id} className="treeview-item" expanded={expanded} onExpandedChange={setExpanded}>
        <TreeView.LeadingAction>
          <IconButton
            icon={GrabberIcon}
            variant="invisible"
            aria-label="Reorder item"
            className="treeview-leading-action"
            draggable="true"
            onDragStart={() => {
              setExpanded(false)
              // other drag logic to follow
            }}
          />
        </TreeView.LeadingAction>
        {children}
      </TreeView.Item>
    </>
  )
}

export const TrailingActions: StoryFn = () => {
  return (
    <div>
      <h2>Trailing Actions: Example with dialog</h2>
      <p> Press (Command + Shift + U) to interact with the trailing action</p>
      <TreeView aria-label="Issues">
        <TreeView.Item id="item-1">Item 1</TreeView.Item>
        <TrailingAction id="item-2" dialogOnOpen={true}>
          Item 2
          <TreeView.SubTree>
            <TreeView.Item id="item-2-sub-task-1">sub task 1</TreeView.Item>
            <TreeView.Item id="item-2-sub-task-2">sub task 2</TreeView.Item>
          </TreeView.SubTree>
        </TrailingAction>
        <TreeView.Item id="item-3">Item 3</TreeView.Item>
      </TreeView>
    </div>
  )
}

const TrailingAction: React.FC<{id: string; children: React.ReactNode; dialogOnOpen?: boolean}> = ({
  id,
  dialogOnOpen,
  children,
}) => {
  const [expanded, setExpanded] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const btnRef = React.useRef<HTMLButtonElement>(null)

  const openActionDialog = () => {
    if (!dialogOnOpen) btnRef.current?.focus()
    if (dialogOnOpen) setDialogOpen(true)
  }

  return (
    <>
      <TreeView.Item
        id={id}
        className="treeview-item"
        expanded={expanded}
        onExpandedChange={setExpanded}
        onKeyDown={openActionDialog}
      >
        {children}
        <TreeView.TrailingAction>
          <IconButton
            icon={GearIcon}
            variant="invisible"
            aria-label="Item settings"
            className="treeview-trailing-action"
            onClick={() => {
              setDialogOpen(true)
            }}
            ref={btnRef}
            tabIndex={-1}
            aria-hidden={true}
          />
          <IconButton
            icon={GearIcon}
            variant="invisible"
            aria-label="Item settings"
            className="treeview-trailing-action"
            onClick={() => {
              setDialogOpen(true)
            }}
            ref={btnRef}
            tabIndex={-1}
            aria-hidden={true}
          />
        </TreeView.TrailingAction>
      </TreeView.Item>

      {dialogOpen ? (
        <Dialog title="My Dialog" onClose={() => setDialogOpen(false)}>
          Dialog that opens when the trailing action is clicked.
        </Dialog>
      ) : null}
    </>
  )
}

export default meta
