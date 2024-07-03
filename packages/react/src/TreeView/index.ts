import {Root, Item, SubTree, LeadingAction, LeadingVisual, TrailingVisual, DirectoryIcon, ErrorDialog} from './TreeView'
import type {
  TreeViewProps,
  TreeViewItemProps,
  SubTreeState,
  TreeViewSubTreeProps,
  TreeViewVisualProps,
  TreeViewErrorDialogProps,
} from './TreeView'

Root.displayName = 'TreeView'
Item.displayName = 'TreeView.Item'
SubTree.displayName = 'TreeView.SubTree'
LeadingVisual.displayName = 'TreeView.LeadingVisual'
TrailingVisual.displayName = 'TreeView.TrailingVisual'
LeadingAction.displayName = 'TreeView.LeadingAction'
ErrorDialog.displayName = 'TreeView.ErrorDialog'

export const TreeView = Object.assign(Root, {
  Item,
  SubTree,
  LeadingAction,
  LeadingVisual,
  TrailingVisual,
  DirectoryIcon,
  ErrorDialog,
})

export type {
  TreeViewProps,
  TreeViewItemProps,
  SubTreeState,
  TreeViewSubTreeProps,
  TreeViewVisualProps,
  TreeViewErrorDialogProps,
}
