import {ChevronDownIcon, ChevronRightIcon} from '@primer/octicons-react'
import React from 'react'
import Box from '../Box'

// ----------------------------------------------------------------------------
// Context

const ItemContext = React.createContext<{
  level: number
  isExpanded: boolean
}>({
  level: 1,
  isExpanded: false
})

// ----------------------------------------------------------------------------
// TreeView

export type TreeViewProps = {
  'aria-label'?: React.AriaAttributes['aria-label']
  'aria-labelledby'?: React.AriaAttributes['aria-labelledby']
  children: React.ReactNode
}

const Root: React.FC<TreeViewProps> = ({'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, children}) => {
  return (
    <Box
      as="ul"
      role="tree"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
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
  onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
  onToggle?: (isExpanded: boolean) => void
}

const Item: React.FC<TreeViewItemProps> = ({onSelect, onToggle, children}) => {
  const {level} = React.useContext(ItemContext)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const {hasSubTree, subTree, childrenWithoutSubTree} = useSubTree(children)

  // Expand or collapse the subtree
  function toggle() {
    onToggle?.(!isExpanded)
    setIsExpanded(!isExpanded)
  }

  return (
    <ItemContext.Provider value={{level: level + 1, isExpanded}}>
      <li
        role="treeitem"
        // TODO: aria-label for treeitem
        aria-level={level}
        aria-expanded={hasSubTree ? isExpanded : undefined}
        onKeyDown={event => {
          if (event.key === ' ' || event.key === 'Enter') {
            onSelect?.(event)
          }
        }}
      >
        <Box
          onClick={event => {
            if (onSelect) {
              onSelect(event)
            } else {
              toggle()
            }
          }}
          sx={{
            display: 'grid',
            gridTemplateColumns: `calc(${level - 1} * 8px) 16px 1fr`,
            gridTemplateAreas: `"spacer toggle content"`,
            width: '100%',
            height: 32,
            fontSize: 1,
            color: 'fg.default',
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'background 33.333ms linear',
            '&:hover': {
              backgroundColor: 'actionListItem.default.hoverBg'
            }
          }}
        >
          {hasSubTree ? (
            <Box
              onClick={event => {
                if (onSelect) {
                  toggle()
                  event.stopPropagation()
                }
              }}
              sx={{
                gridArea: 'toggle',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'fg.muted',
                borderTopLeftRadius: level === 1 ? 2 : 0,
                borderBottomLeftRadius: level === 1 ? 2 : 0,
                '&:hover': {
                  backgroundColor: onSelect ? 'actionListItem.default.hoverBg' : null
                }
              }}
            >
              {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </Box>
          ) : null}
          <Box
            sx={{
              gridArea: 'content',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              px: 2
            }}
          >
            {childrenWithoutSubTree}
          </Box>
        </Box>
        {subTree}
      </li>
    </ItemContext.Provider>
  )
}

// ----------------------------------------------------------------------------
// TreeView.LinkItem

export type TreeViewLinkItemProps = TreeViewItemProps & {
  href?: string
}

// TODO: Use an <a> element to enable native browser behavior like opening links in a new tab
const LinkItem: React.FC<TreeViewLinkItemProps> = ({href, onSelect, ...props}) => {
  return (
    <Item
      onSelect={event => {
        // Navigate by clicking or pressing enter
        if (event.type === 'click' || ('key' in event && event.key === 'Enter')) {
          window.open(href)
        }

        onSelect?.(event)
      }}
      {...props}
    />
  )
}

// ----------------------------------------------------------------------------
// TreeView.SubTree

export type TreeViewSubTreeProps = {
  children?: React.ReactNode
}

const SubTree: React.FC<TreeViewSubTreeProps> = ({children}) => {
  const {isExpanded} = React.useContext(ItemContext)
  return (
    <Box
      as="ul"
      role="group"
      hidden={!isExpanded}
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
