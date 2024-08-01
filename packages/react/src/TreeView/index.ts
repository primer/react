import {Root, Item, SubTree, LeadingAction, LeadingVisual, TrailingVisual, DirectoryIcon, ErrorDialog} from './TreeView'
import type {
  TreeViewProps,
  TreeViewItemProps,
  SubTreeState,
  TreeViewSubTreeProps,
  TreeViewVisualProps,
  TreeViewErrorDialogProps,
} from './TreeView'

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
