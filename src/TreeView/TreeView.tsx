import {ChevronDownIcon, ChevronRightIcon} from '@primer/octicons-react'
import React from 'react'
import Box from '../Box'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'

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
  const {containerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowVertical | FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    getNextFocusable: (direction, from, event) => {
      if (!(from instanceof HTMLElement)) return undefined

      const state = getElementState(from)

      // Reference: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboard-interaction-24
      switch (`${state} ${event.key}`) {
        case 'open ArrowRight':
          // Focus first child node
          return getFirstChildElement(from) || from

        case 'open ArrowLeft':
          // Close node; don't change focus
          return from

        case 'closed ArrowRight':
          // Open node; don't change focus
          return from

        case 'closed ArrowLeft':
          // Focus parent element
          return getParentElement(from)
        // return undefined

        case 'end ArrowRight':
          // Do nothing
          return from

        case 'end ArrowLeft':
          // Focus parent element
          return getParentElement(from)
        // return undefined
      }

      // ArrowUp and ArrowDown behavior is the same regarless of element state
      switch (event.key) {
        case 'ArrowUp':
          // Focus previous visible element
          return getVisibleElement(from, 'previous')

        case 'ArrowDown':
          // Focus next visible element
          return getVisibleElement(from, 'next')
      }

      return undefined
    }
  })

  return (
    <Box
      ref={containerRef}
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

// DOM utilities used for focus management

function getElementState(element: HTMLElement): 'open' | 'closed' | 'end' {
  if (element.getAttribute('role') !== 'treeitem') {
    throw new Error('Element is not a treeitem')
  }

  switch (element.ariaExpanded) {
    case 'true':
      return 'open'
    case 'false':
      return 'closed'
    default:
      return 'end'
  }
}

function getVisibleElement(element: HTMLElement, direction: 'next' | 'previous'): HTMLElement | undefined {
  const root = element.closest('[role=tree]')

  if (!root) return

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, node => {
    if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP
    return node.getAttribute('role') === 'treeitem' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
  })

  let current = walker.firstChild()

  while (current !== element) {
    current = walker.nextNode()
  }

  let next = direction === 'next' ? walker.nextNode() : walker.previousNode()

  // If next element is not visible, continue iterating
  while (next instanceof HTMLElement && !next.offsetParent) {
    next = direction === 'next' ? walker.nextNode() : walker.previousNode()
  }

  return next instanceof HTMLElement ? next : undefined
}

function getFirstChildElement(element: HTMLElement): HTMLElement | undefined {
  const firstChild = element.querySelector('[role=treeitem]')
  return firstChild instanceof HTMLElement ? firstChild : undefined
}

function getParentElement(element: HTMLElement): HTMLElement | undefined {
  const groupElement = element.closest('[role=group]')
  const parent = groupElement?.closest('[role=treeitem]')
  return parent instanceof HTMLElement ? parent : undefined
}

// ----------------------------------------------------------------------------
// TreeView.Item

export type TreeViewItemProps = {
  children: React.ReactNode
  onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
  onToggle?: (isExpanded: boolean) => void
}

const Item: React.FC<TreeViewItemProps> = ({onSelect, onToggle, children}) => {
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
