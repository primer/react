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
// ItemContext

const ItemContext = React.createContext<{
  level: number
}>({level: 1})

// ----------------------------------------------------------------------------
// TreeView.Item

export type TreeViewItemProps = {
  children: React.ReactNode
  onToggle?: (isExpanded: boolean) => void
}

const Item: React.FC<TreeViewItemProps> = ({children}) => {
  const {level} = React.useContext(ItemContext)
  const {subTree, childrenWithoutSubTree} = useSubTree(children)
  return (
    <ItemContext.Provider value={{level: level + 1}}>
      <li role="none">
        <span role="treeitem" aria-level={level}>
          {childrenWithoutSubTree}
        </span>
        {subTree}
      </li>
    </ItemContext.Provider>
  )
}

// ----------------------------------------------------------------------------
// TreeView.LinkItem

export type TreeViewLinkItemProps = TreeViewItemProps & React.ComponentPropsWithoutRef<'a'>

const LinkItem: React.FC<TreeViewLinkItemProps> = ({children, ...props}) => {
  const {level} = React.useContext(ItemContext)
  const {subTree, childrenWithoutSubTree} = useSubTree(children)

  return (
    <ItemContext.Provider value={{level: level + 1}}>
      <li role="none">
        <a {...props} role="treeitem" aria-level={level}>
          {childrenWithoutSubTree}
        </a>
        {subTree}
      </li>
    </ItemContext.Provider>
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

    return {
      subTree,
      childrenWithoutSubTree,
      hasSubTree: Boolean(subTree)
    }
  }, [children])
}

// ----------------------------------------------------------------------------
// Export

export const TreeView = Object.assign(Root, {
  Item,
  LinkItem,
  SubTree
})
