'use client'

import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileDirectoryFillIcon,
  FileDirectoryOpenFillIcon,
} from '@primer/octicons-react'
import React from 'react'
import {isPartOf, resolveRegions} from '../../internal/regions'
import {cn} from '../../internal/cn'

type TreeViewContextValue = {
  activeItemId: string | null
  flat: boolean
  registerItem: (id: string, current: boolean) => void
  selectItem: (id: string) => void
  truncate: boolean
}

type TreeItemContextValue = {
  expanded: boolean
  leadingVisualId: string
  level: number
  trailingVisualId: string
}

export type TreeViewVisualState = {
  expanded: boolean
}

const TreeViewContext = React.createContext<TreeViewContextValue | null>(null)
const TreeItemContext = React.createContext<TreeItemContextValue | null>(null)

export interface TreeViewProps extends Omit<React.ComponentPropsWithoutRef<'ul'>, 'data-component'> {
  /** Removes the indentation guides, for a tree that is only one level deep. */
  flat?: boolean
  /** Clips long item labels to one line instead of wrapping them. */
  truncate?: boolean
}

const Root = React.forwardRef<HTMLElement, TreeViewProps>(function TreeView(
  {className, flat = false, truncate = true, onFocusCapture, onKeyDown, ...props},
  ref,
) {
  const [activeItemId, setActiveItemId] = React.useState<string | null>(null)
  const activeItemIdRef = React.useRef<string | null>(null)
  const typeaheadRef = React.useRef({value: '', timeout: 0})

  const registerItem = React.useCallback((id: string, current: boolean) => {
    if (current || activeItemIdRef.current === null) {
      activeItemIdRef.current = id
      setActiveItemId(id)
    }
  }, [])

  const selectItem = React.useCallback((id: string) => {
    activeItemIdRef.current = id
    setActiveItemId(id)
  }, [])

  const moveFocus = (event: React.KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="treeitem"]'))
    const current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const index = current ? items.indexOf(current) : -1
    const move = (next: HTMLElement | undefined) => {
      if (!next) return
      event.preventDefault()
      selectItem(next.id)
      next.focus()
    }

    if (event.key === 'ArrowDown') move(items[index + 1])
    else if (event.key === 'ArrowUp') move(items[index - 1])
    else if (event.key === 'Home') move(items[0])
    else if (event.key === 'End') move(items.at(-1))
    else if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      window.clearTimeout(typeaheadRef.current.timeout)
      typeaheadRef.current.value += event.key.toLocaleLowerCase()
      typeaheadRef.current.timeout = window.setTimeout(() => {
        typeaheadRef.current.value = ''
      }, 500)
      const start = Math.max(index, 0)
      const match = [...items.slice(start + 1), ...items.slice(0, start + 1)].find(item =>
        item.textContent.trim().toLocaleLowerCase().startsWith(typeaheadRef.current.value),
      )
      move(match)
    }
  }

  return (
    <TreeViewContext.Provider value={{activeItemId, flat, registerItem, selectItem, truncate}}>
      <ul
        {...props}
        ref={ref as React.Ref<HTMLUListElement>}
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
        className={cn('m-0 list-none p-0 text-sm text-default', className)}
      />
    </TreeViewContext.Provider>
  )
})

export interface TreeViewItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'data-component' | 'onSelect'> {
  /** Stable identity for the item, used to track focus and expansion. */
  id: string
  /** Element to render. */
  as?: React.ElementType
  /** Reserves a size for off-screen items so a long tree can skip rendering them. */
  containIntrinsicSize?: string
  /** Marks the item as the one currently being viewed. */
  current?: boolean
  /** Whether the item starts expanded when it owns its own expansion state. */
  defaultExpanded?: boolean
  /** Controls whether the item is expanded. Supply it with `onExpandedChange` to own the state. */
  expanded?: boolean | null
  /** Makes the item a link to the given URL. */
  href?: string
  /** Called with the new state when the item is expanded or collapsed. */
  onExpandedChange?: (expanded: boolean) => void
  /** Called when the item is activated by click or keyboard. */
  onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
  /** Nested items, as an alternative to supplying a subtree child. */
  subtree?: React.ReactNode
  /** Visual shown before the label. Accepts a callback to vary it with the item's expanded state. */
  leadingVisual?: React.ReactNode | ((state: TreeViewVisualState) => React.ReactNode)
  /** Route the item links to, for integration with a router. */
  to?: string
  /** Visual shown after the label. Accepts a callback to vary it with the item's expanded state. */
  trailingVisual?: React.ReactNode | ((state: TreeViewVisualState) => React.ReactNode)
}

const Item = React.forwardRef<HTMLElement, TreeViewItemProps>(function TreeViewItem(
  {
    as: Component = 'li',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    children,
    className,
    containIntrinsicSize,
    current = false,
    defaultExpanded,
    expanded: controlledExpanded,
    leadingVisual,
    onClick,
    onExpandedChange,
    onKeyDown,
    onSelect,
    subtree,
    trailingVisual,
    ...props
  },
  ref,
) {
  const tree = React.useContext(TreeViewContext)
  const parentItem = React.useContext(TreeItemContext)
  if (!tree) throw new Error('TreeView.Item must be rendered within TreeView')

  const {
    matched: {subTree: childSubTrees, leadingVisual: compoundLeadingVisuals, trailingVisual: compoundTrailingVisuals},
    rest: content,
  } = resolveRegions(children, {
    subTree: {match: isPartOf(SubTree), multiple: true},
    leadingVisual: {match: isPartOf(LeadingVisual), multiple: true},
    trailingVisual: {match: isPartOf(TrailingVisual), multiple: true},
  })
  const subTrees =
    childSubTrees.length > 0
      ? childSubTrees
      : subtree !== undefined && subtree !== null
        ? [<SubTree key="compatibility-subtree">{subtree}</SubTree>]
        : []
  const hasSubTree = subTrees.length > 0
  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(defaultExpanded ?? current)
  const expanded = controlledExpanded === null ? false : (controlledExpanded ?? uncontrolledExpanded)
  const leadingVisualId = React.useId()
  const labelId = React.useId()
  const trailingVisualId = React.useId()
  const hasLeadingLabel = compoundLeadingVisuals.some(visual => Boolean(visual.props.label))
  const hasTrailingLabel = compoundTrailingVisuals.some(visual => Boolean(visual.props.label))

  const setExpanded = (next: boolean) => {
    if (controlledExpanded === undefined) setUncontrolledExpanded(next)
    onExpandedChange?.(next)
  }

  const focusItem = (item: HTMLElement | null) => {
    if (!item) return
    tree.selectItem(item.id)
    item.focus()
  }

  const select = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    onSelect?.(event)
    if (!event.defaultPrevented && !onSelect && hasSubTree) setExpanded(!expanded)
  }

  React.useEffect(() => {
    tree.registerItem(props.id, current)
  }, [current, props.id, tree])

  const itemContext = {expanded, leadingVisualId, level: parentItem?.level ?? 1, trailingVisualId}
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      select(event)
    } else if (event.key === 'ArrowRight' && hasSubTree && !expanded) {
      event.preventDefault()
      setExpanded(true)
    } else if (event.key === 'ArrowRight' && hasSubTree) {
      event.preventDefault()
      focusItem(
        event.currentTarget.querySelector<HTMLElement>(':scope > [role="group"] > [role="treeitem"]') ??
          event.currentTarget.parentElement?.querySelector<HTMLElement>(
            ':scope > [role="group"] > [role="treeitem"]',
          ) ??
          null,
      )
    } else if (event.key === 'ArrowLeft' && hasSubTree && expanded) {
      event.preventDefault()
      setExpanded(false)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      const parent = event.currentTarget.parentElement?.closest<HTMLElement>('[role="group"]')?.parentElement
      focusItem(
        parent?.matches('[role="treeitem"]')
          ? parent
          : (parent?.querySelector<HTMLElement>(':scope > [role="treeitem"]') ?? null),
      )
    }
  }

  const row = (
    <div
      className={cn(
        'relative grid min-h-8 w-full items-start rounded-md hover:bg-[var(--control-transparent-bgColor-hover)] focus-within:outline-2 focus-within:outline-focus',
        tree.flat ? 'grid-cols-[minmax(0,1fr)]' : 'grid-cols-[calc((var(--tree-level)-1)*0.5rem)_1rem_minmax(0,1fr)]',
        current &&
          'bg-[var(--control-transparent-bgColor-selected)] before:absolute before:-left-2 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-md before:bg-[var(--fgColor-accent)]',
      )}
      style={
        {
          '--tree-level': itemContext.level,
          contentVisibility: containIntrinsicSize ? 'auto' : undefined,
          containIntrinsicSize,
        } as React.CSSProperties
      }
    >
      {!tree.flat ? (
        <>
          <span aria-hidden="true" />
          <span aria-hidden="true" className="flex h-8 items-center justify-center text-muted">
            {hasSubTree ? expanded ? <ChevronDownIcon size={12} /> : <ChevronRightIcon size={12} /> : null}
          </span>
        </>
      ) : null}
      <span className="flex min-w-0 items-start gap-2 px-2 py-[5.6px] leading-[1.5]">
        {leadingVisual !== undefined ? (
          <VisualContent content={leadingVisual} expanded={expanded} />
        ) : (
          compoundLeadingVisuals
        )}
        <span id={labelId} className={cn('min-w-0 flex-1', tree.truncate ? 'truncate' : 'break-words')}>
          {content}
        </span>
        {trailingVisual !== undefined ? (
          <VisualContent content={trailingVisual} expanded={expanded} />
        ) : (
          compoundTrailingVisuals
        )}
      </span>
    </div>
  )

  const itemProps = {
    ...props,
    ref: ref as React.Ref<never>,
    id: props.id,
    role: 'treeitem',
    tabIndex: tree.activeItemId === props.id ? 0 : -1,
    'aria-label': ariaLabel,
    'aria-current': current || undefined,
    'aria-labelledby': ariaLabel ? undefined : (ariaLabelledby ?? labelId),
    'aria-describedby':
      hasLeadingLabel || hasTrailingLabel
        ? [hasLeadingLabel ? leadingVisualId : null, hasTrailingLabel ? trailingVisualId : null]
            .filter(Boolean)
            .join(' ')
        : undefined,
    'aria-expanded': hasSubTree ? expanded : undefined,
    'aria-level': itemContext.level,
    'data-component': 'TreeView.Item',
    'data-current': current || undefined,
    'data-expanded': hasSubTree ? expanded : undefined,
    className: cn('list-none outline-none', className),
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented) select(event)
      event.stopPropagation()
    },
    onFocus: () => tree.selectItem(props.id),
    onKeyDown: handleKeyDown,
  }

  const nestedTree = subTrees
  const isPolymorphic = Component !== 'li'

  return (
    <TreeItemContext.Provider value={itemContext}>
      {isPolymorphic ? (
        <li role="none" className="list-none">
          <Component {...itemProps}>{row}</Component>
          {nestedTree}
        </li>
      ) : (
        <li {...itemProps}>
          {row}
          {nestedTree}
        </li>
      )}
    </TreeItemContext.Provider>
  )
})

export interface TreeViewSubTreeProps extends Omit<React.ComponentPropsWithoutRef<'ul'>, 'data-component'> {
  /** Number of placeholder rows to show while the subtree loads. */
  count?: number
  /** Loading state of the subtree, which decides whether items, placeholders, or an error are shown. */
  state?: 'initial' | 'loading' | 'done' | 'error'
}

const SubTree = React.forwardRef<HTMLUListElement, TreeViewSubTreeProps>(function TreeViewSubTree(
  {children, className, count, state, ...props},
  ref,
) {
  const item = React.useContext(TreeItemContext)
  const tree = React.useContext(TreeViewContext)
  if (!item || !tree) throw new Error('TreeView.SubTree must be rendered within TreeView.Item')
  if (!item.expanded) return null

  const loadingRows = Array.from({length: count ?? 1}, (_, index) => (
    <li key={index} role="none" className="list-none">
      <span
        role="status"
        className="flex min-h-8 items-center gap-2 px-2 text-muted"
        aria-label={count ? `Loading ${count} items` : 'Loading'}
      >
        <span className="size-4 animate-pulse rounded-sm bg-muted" aria-hidden="true" />
        <span className="h-3 w-2/3 animate-pulse rounded-sm bg-muted" aria-hidden="true" />
      </span>
    </li>
  ))

  return (
    <TreeItemContext.Provider value={{...item, level: item.level + 1}}>
      <ul
        {...props}
        ref={ref}
        role="group"
        data-component="TreeView.SubTree"
        data-state={state}
        className={cn('m-0 list-none p-0', className)}
      >
        {state === 'loading' ? loadingRows : children}
      </ul>
    </TreeItemContext.Provider>
  )
})

export interface TreeViewVisualProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children' | 'data-component'> {
  children: React.ReactNode | ((state: TreeViewVisualState) => React.ReactNode)
  /** Accessible name for the visual, which is announced as part of the item. */
  label?: string
}

function renderVisual(content: TreeViewVisualProps['children'], expanded: boolean) {
  return typeof content === 'function' ? content({expanded}) : content
}

const VisualContent = ({
  content,
  expanded,
}: {
  content: React.ReactNode | ((state: TreeViewVisualState) => React.ReactNode)
  expanded: boolean
}) => (
  <span aria-hidden="true" className="flex shrink-0 items-center text-muted">
    {renderVisual(content, expanded)}
  </span>
)

const LeadingVisual = React.forwardRef<HTMLSpanElement, TreeViewVisualProps>(function TreeViewLeadingVisual(
  {children, className, label, ...props},
  ref,
) {
  const item = React.useContext(TreeItemContext)
  return (
    <span
      {...props}
      ref={ref}
      id={label ? item?.leadingVisualId : undefined}
      aria-hidden={label ? undefined : true}
      className={cn('flex shrink-0 items-center text-muted', className)}
      data-component="TreeView.LeadingVisual"
    >
      {renderVisual(children, item?.expanded ?? false)}
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  )
})

const TrailingVisual = React.forwardRef<HTMLSpanElement, TreeViewVisualProps>(function TreeViewTrailingVisual(
  {children, className, label, ...props},
  ref,
) {
  const item = React.useContext(TreeItemContext)
  return (
    <span
      {...props}
      ref={ref}
      id={label ? item?.trailingVisualId : undefined}
      aria-hidden={label ? undefined : true}
      className={cn('ml-auto flex shrink-0 items-center text-muted', className)}
      data-component="TreeView.TrailingVisual"
    >
      {renderVisual(children, item?.expanded ?? false)}
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  )
})

export type TreeViewDirectoryIconProps = Omit<React.ComponentPropsWithoutRef<'span'>, 'data-component'>

const DirectoryIcon = React.forwardRef<HTMLSpanElement, TreeViewDirectoryIconProps>(function TreeViewDirectoryIcon(
  {className, ...props},
  ref,
) {
  const item = React.useContext(TreeItemContext)
  const Icon = item?.expanded ? FileDirectoryOpenFillIcon : FileDirectoryFillIcon
  return (
    <span
      {...props}
      ref={ref}
      aria-hidden="true"
      className={cn('grid text-[var(--treeViewItem-leadingVisual-iconColor-rest)]', className)}
      data-component="TreeView.DirectoryIcon"
    >
      <Icon size={16} />
    </span>
  )
})

export const TreeView = Object.assign(Root, {DirectoryIcon, Item, LeadingVisual, SubTree, TrailingVisual})

Root.displayName = 'TreeView'
Item.displayName = 'TreeView.Item'
SubTree.displayName = 'TreeView.SubTree'
LeadingVisual.displayName = 'TreeView.LeadingVisual'
TrailingVisual.displayName = 'TreeView.TrailingVisual'
DirectoryIcon.displayName = 'TreeView.DirectoryIcon'
