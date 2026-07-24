import {ChevronDownIcon, ChevronRightIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'

const TreeLevelContext = React.createContext(1)
const treeItemRole: React.AriaRole = 'treeitem'
type TreeContextValue = {
  activeItemId: string | null
  registerItem: (id: string) => void
  selectItem: (id: string) => void
}
const TreeContext = React.createContext<TreeContextValue | null>(null)

export interface TreeViewProps extends React.ComponentPropsWithoutRef<'ul'> {
  flat?: boolean
  truncate?: boolean
}

const Root = React.forwardRef<HTMLUListElement, TreeViewProps>(function TreeView(
  {className, flat = false, truncate = true, onFocusCapture, onKeyDown, ...props},
  ref,
) {
  const [activeItemId, setActiveItemId] = React.useState<string | null>(null)
  const registerItem = React.useCallback((id: string) => {
    setActiveItemId(current => current ?? id)
  }, [])
  const selectItem = React.useCallback((id: string) => {
    setActiveItemId(id)
  }, [])
  const moveFocus = (event: React.KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="treeitem"]'))
    const current = document.activeElement as HTMLElement | null
    const index = items.indexOf(current as HTMLElement)
    if (index < 0) return
    const next =
      event.key === 'Home'
        ? items[0]
        : event.key === 'End'
          ? items.at(-1)
          : items[index + (event.key === 'ArrowDown' ? 1 : -1)]
    if (!next) return
    event.preventDefault()
    selectItem(next.id)
    next.focus()
  }
  return (
    <TreeContext.Provider value={{activeItemId, registerItem, selectItem}}>
      <TreeLevelContext.Provider value={1}>
        <ul
          {...props}
          ref={ref}
          role="tree"
          onKeyDown={moveFocus}
          onFocusCapture={event => {
            onFocusCapture?.(event)
            if (event.target instanceof HTMLElement && event.target.getAttribute('role') === 'treeitem') {
              selectItem(event.target.id)
            }
          }}
          data-component="TreeView"
          data-flat={flat || undefined}
          data-truncate={truncate || undefined}
          className={cn('m-0 list-none p-0 text-sm', className)}
        />
      </TreeLevelContext.Provider>
    </TreeContext.Provider>
  )
})

export interface TreeViewItemProps extends Omit<React.ComponentPropsWithoutRef<'li'>, 'onSelect'> {
  id: string
  current?: boolean
  defaultExpanded?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
  subtree?: React.ReactNode
  leadingVisual?: React.ReactNode
  trailingVisual?: React.ReactNode
}

const Item = React.forwardRef<HTMLLIElement, TreeViewItemProps>(function TreeViewItem(
  {
    children,
    className,
    current,
    defaultExpanded = false,
    expanded: controlledExpanded,
    leadingVisual,
    onExpandedChange,
    onKeyDown,
    onSelect,
    subtree,
    trailingVisual,
    ...props
  },
  ref,
) {
  const level = React.useContext(TreeLevelContext)
  const tree = React.useContext(TreeContext)
  if (!tree) throw new Error('TreeView.Item must be rendered within TreeView')
  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(defaultExpanded)
  const expanded = controlledExpanded ?? uncontrolledExpanded
  const hasSubtree = subtree !== undefined && subtree !== null
  const setExpanded = (next: boolean) => {
    if (controlledExpanded === undefined) setUncontrolledExpanded(next)
    onExpandedChange?.(next)
  }
  const select = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    if (onSelect) onSelect(event)
    else if (hasSubtree) setExpanded(!expanded)
  }
  React.useEffect(() => {
    tree.registerItem(props.id)
  }, [props.id, tree])
  const focusItem = (item: HTMLElement | null) => {
    if (item) {
      tree.selectItem(item.id)
      item.focus()
    }
  }
  const parentItem = (item: HTMLElement) =>
    item.parentElement
      ?.closest<HTMLElement>('[role="group"]')
      ?.parentElement?.closest<HTMLElement>('[role="treeitem"]') ?? null
  const itemInteractionProps = {
    onClick: (event: React.MouseEvent<HTMLLIElement>) => select(event),
    onKeyDown: (event: React.KeyboardEvent<HTMLLIElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        select(event)
      } else if (event.key === 'ArrowRight' && hasSubtree && !expanded) {
        event.preventDefault()
        setExpanded(true)
      } else if (event.key === 'ArrowRight' && hasSubtree) {
        event.preventDefault()
        focusItem(event.currentTarget.querySelector<HTMLElement>(':scope > [role="group"] > [role="treeitem"]'))
      } else if (event.key === 'ArrowLeft' && hasSubtree && expanded) {
        event.preventDefault()
        setExpanded(false)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        focusItem(parentItem(event.currentTarget))
      }
    },
  }
  return (
    <li
      {...props}
      ref={ref}
      role={treeItemRole}
      tabIndex={tree.activeItemId === props.id ? 0 : -1}
      aria-current={current ? 'true' : undefined}
      aria-expanded={hasSubtree ? expanded : undefined}
      aria-level={level}
      data-component="TreeView.Item"
      data-current={current || undefined}
      data-expanded={hasSubtree ? expanded : undefined}
      className={cn('list-none', className)}
      {...itemInteractionProps}
    >
      <div className="flex min-h-8 items-center gap-2 rounded-md px-2 hover:bg-muted focus-within:outline-2 focus-within:outline-focus">
        {hasSubtree ? (
          <span aria-hidden="true" className="text-muted">
            {expanded ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
          </span>
        ) : (
          <span className="w-4" aria-hidden="true" />
        )}
        {leadingVisual ? <span aria-hidden="true">{leadingVisual}</span> : null}
        <span className="min-w-0 flex-1 truncate">{children}</span>
        {trailingVisual ? <span aria-hidden="true">{trailingVisual}</span> : null}
      </div>
      {hasSubtree && expanded ? (
        <TreeLevelContext.Provider value={level + 1}>
          <ul role="group" className="m-0 list-none p-0 pl-3">
            {subtree}
          </ul>
        </TreeLevelContext.Provider>
      ) : null}
    </li>
  )
})

export type TreeViewSubTreeProps = React.ComponentPropsWithoutRef<'ul'>
const SubTree = React.forwardRef<HTMLUListElement, TreeViewSubTreeProps>(function TreeViewSubTree(
  {className, ...props},
  ref,
) {
  const level = React.useContext(TreeLevelContext)
  return (
    <TreeLevelContext.Provider value={level + 1}>
      <ul
        {...props}
        ref={ref}
        role="group"
        data-component="TreeView.SubTree"
        className={cn('m-0 list-none p-0 pl-3', className)}
      />
    </TreeLevelContext.Provider>
  )
})

export const TreeView = Object.assign(Root, {Item, SubTree})
Root.displayName = 'TreeView'
Item.displayName = 'TreeView.Item'
SubTree.displayName = 'TreeView.SubTree'
