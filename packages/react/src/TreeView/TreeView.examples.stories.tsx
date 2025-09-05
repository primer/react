import {GrabberIcon} from '@primer/octicons-react'
import type {Meta, StoryFn} from '@storybook/react-vite'
import React from 'react'
import {TreeView} from './TreeView'
import {IconButton} from '../Button'
import classes from './TreeViewStories.module.css'

const meta: Meta = {
  title: 'Components/TreeView/Examples',
  component: TreeView,
  decorators: [
    Story => {
      return (
        // Prevent TreeView from expanding to the full width of the screen
        <div className={classes.WidthContraintContainer}>
          <Story />
        </div>
      )
    },
  ],
}

export const DraggableListItem: StoryFn = () => {
  return (
    <div className={classes.DraggableItemContainer}>
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
    </div>
  )
}

const ControlledDraggableItem: React.FC<{id: string; children: React.ReactNode}> = ({id, children}) => {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <>
      <TreeView.Item id={id} className={classes.TreeViewItem} expanded={expanded} onExpandedChange={setExpanded}>
        <TreeView.LeadingAction>
          <IconButton
            icon={GrabberIcon}
            variant="invisible"
            aria-label="Reorder item"
            className={classes.TreeViewLeadingAction}
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

export default meta
