import React from 'react'
import Box from '../Box'

// ----------------------------------------------------------------------------
// TreeView

export type TreeViewProps = {
  children: React.ReactNode
}

const Root: React.FC<TreeViewProps> = ({children}) => {
  return (
    <Box
      as="ul"
      role="tree"
      sx={{
        listStyle: 'none',
        padding: 0,
        margin: 0
      }}
    >
      {children}
    </Box>
  )
}

// ----------------------------------------------------------------------------
// TreeView.Item

export type TreeViewItemProps = {
  children: React.ReactNode
  onToggle?: (isExpanded: boolean) => void
}

const Item: React.FC<TreeViewItemProps> = ({children}) => {
  const {subTree, childrenWithoutSubTree} = useSubTree(children)
  return (
    <li role="treeitem">
      <span>{childrenWithoutSubTree}</span>
      {subTree}
    </li>
  )
}

// ----------------------------------------------------------------------------
// TreeView.LinkItem

export type TreeViewLinkItemProps = TreeViewItemProps & React.ComponentPropsWithoutRef<'a'>

const LinkItem: React.FC<TreeViewLinkItemProps> = ({children, ...props}) => {
  const {subTree, childrenWithoutSubTree} = useSubTree(children)

  // QUESTION: Should <li role="treeitem"> or <a> be focusable?
  return (
    <li role="treeitem">
      <a {...props}>{childrenWithoutSubTree}</a>
      {subTree}
    </li>
  )
}

// ----------------------------------------------------------------------------
// TreeView.SubTree

export type TreeViewSubTreeProps = {
  children?: React.ReactNode
}

const SubTree: React.FC<TreeViewSubTreeProps> = ({children}) => {
  return (
    <Box
      as="ul"
      role="group"
      sx={{
        listStyle: 'none',
        padding: 0,
        margin: 0
      }}
    >
      {children}
    </Box>
  )
}

function useSubTree(children: React.ReactNode) {
  return React.useMemo(() => {
    const subTree = React.Children.toArray(children).find(
      child => React.isValidElement(child) && child.type === SubTree
    )

    const childrenWithoutSubTree = React.Children.toArray(children).filter(
      child => !(React.isValidElement(child) && child.type === SubTree)
    )

    return {subTree, childrenWithoutSubTree}
  }, [children])
}

// ----------------------------------------------------------------------------
// Export

export const TreeView = Object.assign(Root, {
  Item,
  LinkItem,
  SubTree
})
