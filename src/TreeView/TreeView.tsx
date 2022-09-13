import {ChevronDownIcon, ChevronRightIcon} from '@primer/octicons-react'
import {useSSRSafeId} from '@react-aria/ssr'
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
  const [activeDescendant, setActiveDescendant] = React.useState('')

  React.useEffect(() => {
    // Initialize the active descendant to the first item in the tree
    if (!activeDescendant) {
      const firstItem = document.querySelector('[role="treeitem"]')
      if (firstItem) setActiveDescendant(firstItem.id)
    }
  }, [activeDescendant])

  return (
    <Box
      as="ul"
      tabIndex={0}
      role="tree"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-activedescendant={activeDescendant}
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

// DOM utilities used for focus management

// function getElementState(element: HTMLElement): 'open' | 'closed' | 'end' {
//   if (element.getAttribute('role') !== 'treeitem') {
//     throw new Error('Element is not a treeitem')
//   }

//   switch (element.ariaExpanded) {
//     case 'true':
//       return 'open'
//     case 'false':
//       return 'closed'
//     default:
//       return 'end'
//   }
// }

// function getVisibleElement(element: HTMLElement, direction: 'next' | 'previous'): HTMLElement | undefined {
//   const root = element.closest('[role=tree]')

//   if (!root) return

//   const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, node => {
//     if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP
//     return node.getAttribute('role') === 'treeitem' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
//   })

//   let current = walker.firstChild()

//   while (current !== element) {
//     current = walker.nextNode()
//   }

//   let next = direction === 'next' ? walker.nextNode() : walker.previousNode()

//   // If next element is not visible, continue iterating
//   while (next instanceof HTMLElement && !next.offsetParent) {
//     next = direction === 'next' ? walker.nextNode() : walker.previousNode()
//   }

//   return next instanceof HTMLElement ? next : undefined
// }

// function getFirstChildElement(element: HTMLElement): HTMLElement | undefined {
//   const firstChild = element.querySelector('[role=treeitem]')
//   return firstChild instanceof HTMLElement ? firstChild : undefined
// }

// function getParentElement(element: HTMLElement): HTMLElement | undefined {
//   const groupElement = element.closest('[role=group]')
//   const parent = groupElement?.closest('[role=treeitem]')
//   return parent instanceof HTMLElement ? parent : undefined
// }

// ----------------------------------------------------------------------------
// TreeView.Item

export type TreeViewItemProps = {
  children: React.ReactNode
  onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
  onToggle?: (isExpanded: boolean) => void
}

const Item: React.FC<TreeViewItemProps> = ({onSelect, onToggle, children}) => {
  const itemId = useSSRSafeId()
  const itemRef = React.useRef<HTMLLIElement>(null)
  const {level} = React.useContext(ItemContext)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const {hasSubTree, subTree, childrenWithoutSubTree} = useSubTree(children)

  // Expand or collapse the subtree
  function toggle(event: React.MouseEvent | React.KeyboardEvent) {
    onToggle?.(!isExpanded)
    setIsExpanded(!isExpanded)
    event.stopPropagation()
  }

  return (
    <ItemContext.Provider value={{level: level + 1, isExpanded}}>
      <li
        id={itemId}
        ref={itemRef}
        role="treeitem"
        tabIndex={0}
        // TODO: aria-label for treeitem
        aria-level={level}
        aria-expanded={hasSubTree ? isExpanded : undefined}
        onKeyDown={event => {
          if (event.target !== itemRef.current) return

          if (event.key === ' ' || event.key === 'Enter') {
            if (onSelect) {
              onSelect(event)
            } else {
              toggle(event)
            }
          }

          if (event.key === 'ArrowRight') {
            if (!isExpanded) {
              setIsExpanded(true)
              event.preventDefault()
            }
          }

          if (event.key === 'ArrowLeft') {
            if (isExpanded) {
              setIsExpanded(false)
              event.preventDefault()
            }
          }
        }}
      >
        <Box
          onClick={event => {
            if (onSelect) {
              onSelect(event)
            } else {
              toggle(event)
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
                  toggle(event)
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
