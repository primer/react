'use client'

import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileDirectoryFillIcon,
  FileDirectoryOpenFillIcon,
} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {isIconComponent, renderIcon, type IconSource} from '../../internal/icon'
import {mergeRefs} from '../../internal/refs'
import {isPartOf, resolveRegions, type RegionMatcher} from '../../internal/regions'
import {ActionList} from '../ActionList'
import {Button} from '../Button'
import {ConfirmationDialog} from '../ConfirmationDialog'
import {Dialog} from '../Dialog'
import {IconButton} from '../IconButton'
import {getAccessibleKeybindingHintString} from '../KeybindingHint'
import {usePlatform} from '../KeybindingHint/utils'
import {AriaStatus} from '../LiveRegion'
import {SkeletonAvatar} from '../SkeletonAvatar'
import {SkeletonText} from '../SkeletonText'
import {Spinner} from '../Spinner'
import {Tooltip} from '../Tooltip'
import {VisuallyHidden} from '../VisuallyHidden'
import {
  getAccessibleName,
  getFirstChildItem,
  getLabelText,
  getPageSize,
  getParentItem,
  getTreeItems,
  isItemOf,
} from './treeNavigation'

// ----------------------------------------------------------------------------
// Roving tab stop

/**
 * Tracks which item holds the tree's single tab stop. Items subscribe with `useSyncExternalStore`, so moving focus
 * re-renders only the item losing the tab stop and the one gaining it rather than the whole tree.
 *
 * While focus is inside the tree, the tab stop follows the focused item. Once focus leaves, it returns to the current
 * item, then the last focused one, then the first, so tabbing back in lands where the user expects. The store also
 * caches expanded state by item id, because collapsing a parent unmounts its children.
 */
function createTreeStore() {
  let root: HTMLElement | null = null
  let active: string | null = null
  let current: string | null = null
  let first: string | null = null
  let tabStop: string | null = null
  let focusWithin = false
  let synced = false
  const expanded = new Map<string, boolean>()
  const listeners = new Set<() => void>()

  function update() {
    const next = focusWithin && active ? active : (current ?? active ?? first)
    if (synced && next === tabStop) return
    synced = true
    tabStop = next
    for (const listener of listeners) listener()
  }

  function sync() {
    if (!root) return
    const items = getTreeItems(root)
    first = items[0]?.id ?? null
    current = items.find(item => item.getAttribute('aria-current') === 'true')?.id ?? null
    if (active !== null && !items.some(item => item.id === active)) active = null
    update()
  }

  return {
    connect(node: HTMLElement | null) {
      if (!node) return
      root = node
      sync()
      // Items mount, unmount and change `current` as subtrees expand and routes change.
      const observer = new MutationObserver(sync)
      observer.observe(node, {attributeFilter: ['aria-current', 'id'], childList: true, subtree: true})
      return () => {
        observer.disconnect()
        if (root === node) root = null
      }
    },
    focus(id: string) {
      active = id
      focusWithin = true
      update()
    },
    setFocusWithin(value: boolean) {
      focusWithin = value
      update()
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    /** Whether `id` holds the tab stop, falling back to `fallback` until the store has read the rendered tree. */
    isTabStop(id: string, fallback: boolean) {
      return synced ? tabStop === id : fallback
    },
    getExpanded(id: string) {
      return expanded.get(id)
    },
    setExpanded(id: string, value: boolean) {
      expanded.set(id, value)
    },
  }
}

type TreeStore = ReturnType<typeof createTreeStore>

// ----------------------------------------------------------------------------
// Context

type TreeViewContextValue = {
  announce: (message: string) => void
  flat: boolean
  store: TreeStore
  truncate: boolean
}

type TreeItemContextValue = {
  /** The item's own `aria-label`, without the shortcut hint that secondary actions append to its name. */
  ariaLabel: string | undefined
  expanded: boolean
  groupId: string
  itemId: string
  itemRef: React.RefObject<HTMLElement | null>
  /** Ids naming the item, without the shortcut hint that secondary actions append to its name. */
  labelledBy: string
  leadingVisualId: string
  level: number
  setExpanded: (expanded: boolean) => void
  trailingVisualId: string
}

export type TreeViewVisualState = {
  /** Whether the item's subtree is expanded. */
  expanded: boolean
}

const TreeViewContext = React.createContext<TreeViewContextValue | null>(null)
const TreeItemContext = React.createContext<TreeItemContextValue | null>(null)
// Marks the item that LoadingItem renders, so the row can drop its hover affordances without a public prop.
const LoadingPlaceholderContext = React.createContext(false)

const ITEM_PART_SELECTOR = [
  '[role="treeitem"]',
  '[data-component="TreeView.LeadingAction"]',
  '[data-component="TreeView.TrailingAction"]',
  '[data-component="TreeView.Toggle"]',
].join(',')

const FOCUSABLE_SELECTOR =
  'a[href], area[href], button, input, select, textarea, iframe, [tabindex], [contenteditable="true"]'

const TYPEAHEAD_RESET_MS = 300

// ----------------------------------------------------------------------------
// TreeView

export interface TreeViewProps extends Omit<React.ComponentPropsWithoutRef<'ul'>, 'data-component'> {
  /** Removes the indentation guides, for a tree that is only one level deep. */
  flat?: boolean
  /** Clips long item labels to one line instead of wrapping them. */
  truncate?: boolean
}

const Root = React.forwardRef<HTMLUListElement, TreeViewProps>(function TreeView(
  {children, className, flat = false, truncate = true, onBlur, onFocus, onKeyDown, ...props},
  ref,
) {
  const [store] = React.useState(createTreeStore)
  const [message, setMessage] = React.useState<{id: number; text: string} | null>(null)
  const pending = React.useRef<{frame?: number; query: string; timeout?: number}>({query: ''})
  const rootRef = React.useMemo(() => mergeRefs(ref, store.connect), [ref, store])

  // A new node for every message makes the status region announce repeated text, such as two loads of one folder.
  const announce = React.useCallback((text: string) => {
    setMessage(previous => ({id: (previous?.id ?? 0) + 1, text}))
  }, [])

  React.useEffect(() => {
    const state = pending.current
    return () => {
      window.clearTimeout(state.timeout)
      if (state.frame !== undefined) window.cancelAnimationFrame(state.frame)
    }
  }, [])

  const handleFocus = (event: React.FocusEvent<HTMLUListElement>) => {
    onFocus?.(event)
    const tree = event.currentTarget
    const target = event.target
    if (!isItemOf(tree, target)) {
      // Focus inside a row, such as on a link in its label, keeps the item's tab stop; a portal does not.
      store.setFocusWithin(tree.contains(target))
      return
    }
    store.focus(target.id)
    // Scrolling once per frame keeps a held arrow key from forcing a layout for every item it passes.
    const state = pending.current
    if (state.frame !== undefined) window.cancelAnimationFrame(state.frame)
    state.frame = window.requestAnimationFrame(() => {
      state.frame = undefined
      const row = target.firstElementChild
      if (target.isConnected && row && typeof row.scrollIntoView === 'function') {
        row.scrollIntoView({block: 'nearest', inline: 'nearest'})
      }
    })
  }

  const handleBlur = (event: React.FocusEvent<HTMLUListElement>) => {
    onBlur?.(event)
    const next = event.relatedTarget
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) store.setFocusWithin(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(event)
    const tree = event.currentTarget
    const target = event.target
    if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey) return
    if (!(target instanceof Element) || !isItemOf(tree, target)) return

    const items = getTreeItems(tree)
    const index = items.indexOf(target)
    let next: HTMLElement | undefined
    switch (event.key) {
      case 'ArrowDown':
        next = items[index + 1]
        break
      case 'ArrowUp':
        next = index > 0 ? items[index - 1] : undefined
        break
      case 'Home':
        next = items[0]
        break
      case 'End':
        next = items.at(-1)
        break
      case 'PageDown':
        next = items[Math.min(items.length - 1, index + getPageSize(tree, items))]
        break
      case 'PageUp':
        next = items[Math.max(0, index - getPageSize(tree, items))]
        break
      default: {
        if (event.key.length !== 1 || /\s/.test(event.key)) return
        const state = pending.current
        window.clearTimeout(state.timeout)
        state.query += event.key.toLowerCase()
        state.timeout = window.setTimeout(() => {
          state.query = ''
        }, TYPEAHEAD_RESET_MS)
        // Search from the focused item and wrap. Repeating one character cycles through the items it starts.
        const ordered = [...items.slice(index), ...items.slice(0, index)]
        const candidates = state.query.length === 1 ? ordered.slice(1) : ordered
        next = candidates.find(item => getAccessibleName(item).toLowerCase().startsWith(state.query))
        if (!next) return
      }
    }
    event.preventDefault()
    next?.focus({preventScroll: true})
  }

  return (
    <TreeViewContext.Provider value={{announce, flat, store, truncate}}>
      <TreeItemContext.Provider value={null}>
        <AriaStatus announceOnShow className="sr-only">
          {message ? <span key={message.id}>{message.text}</span> : null}
        </AriaStatus>
        <ul
          {...props}
          ref={rootRef}
          role="tree"
          data-component="TreeView"
          data-flat={flat || undefined}
          data-truncate={truncate || undefined}
          className={cn(
            'm-0 list-none p-0 text-sm text-default',
            '[--tree-min-item-height:2rem] [--tree-toggle-width:1rem] pointer-coarse:[--tree-min-item-height:2.75rem] pointer-coarse:[--tree-toggle-width:1.5rem]',
            // Level lines show while a hover-capable pointer is over the tree or focus is in it, and always on touch.
            '[@media(hover:hover)]:[--tree-line-color:transparent] [@media(hover:hover)]:hover:[--tree-line-color:var(--borderColor-muted)] [@media(hover:hover)]:focus-within:[--tree-line-color:var(--borderColor-muted)]',
            className,
          )}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        >
          {children}
        </ul>
      </TreeItemContext.Provider>
    </TreeViewContext.Provider>
  )
})

// ----------------------------------------------------------------------------
// TreeView.Item

export type TreeViewSecondaryActions = {
  /** Accessible name of the action, also shown in its tooltip and in the actions dialog. */
  label: string
  /** Called when the action is chosen, by pointer or through the actions shortcut. */
  onClick: () => void
  /** Icon shown for the action. */
  icon: IconSource
  /** Count shown next to the icon, such as a number of comments. */
  count?: number | string
  /** Class name applied to the action's button. */
  className?: string
}

export interface TreeViewItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'data-component' | 'onSelect'> {
  /** Stable identity for the item, used to track focus and expansion. */
  id: string
  /** Element to render. Anything other than `li` is wrapped in a presentational list item. */
  as?: React.ElementType
  /** Reserves a size for off-screen items so a long tree can skip rendering them. */
  containIntrinsicSize?: string
  /** Marks the item as the one currently being viewed. */
  current?: boolean
  /** Whether the item starts expanded when it owns its own expansion state. */
  defaultExpanded?: boolean
  /**
   * Controls whether the item is expanded. Supply it with `onExpandedChange` to own the state. `null` keeps the item
   * collapsed and leaves its expanded state unannounced.
   */
  expanded?: boolean | null
  /** Makes the item a link to the given URL. */
  href?: string
  /** Action shown before the toggle, such as a drag handle. Accepts a callback to vary it with the expanded state. */
  leadingAction?: React.ReactNode | ((state: TreeViewVisualState) => React.ReactNode)
  /** Visual shown before the label. Accepts a callback to vary it with the item's expanded state. */
  leadingVisual?: React.ReactNode | ((state: TreeViewVisualState) => React.ReactNode)
  /** Called with the new state when the item is expanded or collapsed. */
  onExpandedChange?: (expanded: boolean) => void
  /** Called when the item is activated by click or keyboard. */
  onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
  /**
   * Actions shown at the end of the row for pointer users. Keyboard users reach them with Shift+Meta+U on Apple
   * platforms or Shift+Control+U elsewhere: one action runs directly, several open a dialog to choose from.
   */
  secondaryActions?: TreeViewSecondaryActions[]
  /** Nested items, as an alternative to supplying a subtree child. Takes precedence over a `TreeView.SubTree` child. */
  subtree?: React.ReactNode
  /** Route the item links to, for integration with a router. */
  to?: string
  /** Visual shown after the label. Accepts a callback to vary it with the item's expanded state. */
  trailingVisual?: React.ReactNode | ((state: TreeViewVisualState) => React.ReactNode)
}

/**
 * Resolves a part supplied either as a prop or as a child. A prop wins; a prop that is already the part is used as
 * is, and any other content is wrapped in the part.
 */
function resolvePart<Value, Props>(
  value: Value | null | undefined | false,
  matches: RegionMatcher<Props>,
  wrap: (value: Value) => React.ReactElement<Props>,
  fallback?: React.ReactElement<Props>,
): React.ReactElement<Props> | undefined {
  if (value === null || value === undefined || value === false) return fallback
  if (React.isValidElement(value) && matches(value)) return value
  return wrap(value)
}

const Item = React.forwardRef<HTMLElement, TreeViewItemProps>(function TreeViewItem(
  {
    as: Component = 'li',
    'aria-describedby': ariaDescribedby,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    children,
    className,
    containIntrinsicSize,
    current = false,
    defaultExpanded,
    expanded: controlledExpanded,
    id,
    leadingAction,
    leadingVisual,
    onAuxClick,
    onClick,
    onExpandedChange,
    onKeyDown,
    onSelect,
    secondaryActions,
    subtree,
    trailingVisual,
    ...props
  },
  ref,
) {
  const tree = React.useContext(TreeViewContext)
  if (!tree) throw new Error('TreeView.Item must be rendered within TreeView')
  const {flat, store, truncate} = tree
  const parent = React.useContext(TreeItemContext)
  const isLoadingPlaceholder = React.useContext(LoadingPlaceholderContext)
  const platform = usePlatform()
  const itemRef = React.useRef<HTMLElement | null>(null)
  const mergedRef = React.useMemo(() => mergeRefs(ref, itemRef), [ref])
  const labelId = React.useId()
  const leadingVisualId = React.useId()
  const trailingVisualId = React.useId()
  const trailingActionId = React.useId()
  const fallbackGroupId = React.useId()
  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(
    // Collapsing a parent unmounts its children, so a remounted item restores its last state.
    () => store.getExpanded(id) ?? defaultExpanded ?? current,
  )
  const isTabStop = React.useSyncExternalStore(
    store.subscribe,
    () => store.isTabStop(id, current),
    () => current,
  )
  // The actions dialog mounts on first use and then stays mounted so it can animate closed.
  const [actionDialog, setActionDialog] = React.useState<'open' | 'closed' | null>(null)

  const {matched, rest: label} = resolveRegions(children, {
    leadingAction: {match: isPartOf(LeadingAction)},
    leadingVisual: {match: isPartOf(LeadingVisual)},
    subTree: {match: isPartOf(SubTree)},
    trailingVisual: {match: isPartOf(TrailingVisual)},
  })
  const leadingActionElement = resolvePart(
    leadingAction,
    isPartOf(LeadingAction),
    content => <LeadingAction>{content}</LeadingAction>,
    matched.leadingAction[0],
  )
  const leadingVisualElement = resolvePart(
    leadingVisual,
    isPartOf(LeadingVisual),
    content => <LeadingVisual>{content}</LeadingVisual>,
    matched.leadingVisual[0],
  )
  const trailingVisualElement = resolvePart(
    trailingVisual,
    isPartOf(TrailingVisual),
    content => <TrailingVisual>{content}</TrailingVisual>,
    matched.trailingVisual[0],
  )
  const subTreeElement = resolvePart(
    subtree,
    isPartOf(SubTree),
    content => <SubTree>{content}</SubTree>,
    matched.subTree[0],
  )

  const level = (parent?.level ?? 0) + 1
  const isPolymorphic = Component !== 'li'
  const hasSubTree = subTreeElement !== undefined
  const subTreeState = subTreeElement?.props.state
  const isSubTreeEmpty =
    hasSubTree &&
    (subTreeState === undefined || subTreeState === 'done') &&
    React.Children.toArray(subTreeElement.props.children).length === 0
  const groupId = subTreeElement?.props.id ?? fallbackGroupId
  const expanded = controlledExpanded === null ? false : (controlledExpanded ?? uncontrolledExpanded)

  const setExpanded = (next: boolean) => {
    store.setExpanded(id, next)
    if (next === expanded) return
    if (controlledExpanded === undefined) setUncontrolledExpanded(next)
    onExpandedChange?.(next)
  }

  const actions = secondaryActions?.length ? secondaryActions : undefined
  const shortcut = `Shift+${platform === 'apple' ? 'Meta' : 'Control'}+U`
  const shortcutText = `Press (${getAccessibleKeybindingHintString(shortcut, platform)}) for more actions.`
  const labelledBy = ariaLabelledby || labelId
  const describedBy =
    [
      ariaDescribedby,
      leadingVisualElement?.props.label ? leadingVisualId : null,
      trailingVisualElement?.props.label ? trailingVisualId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined

  const activate = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    if (onSelect) onSelect(event)
    else if (hasSubTree) setExpanded(!expanded)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    // Keys pressed in a child item bubble through its ancestors, which leave them to the child.
    if (event.defaultPrevented || event.target !== event.currentTarget) return
    const item = event.currentTarget
    const hasModifier = event.ctrlKey || event.altKey || event.metaKey

    switch (event.key) {
      case 'Enter':
      case ' ': {
        // Native buttons and links activate with a click, which `handleClick` already handles.
        if (item instanceof HTMLButtonElement) return
        if (event.key === 'Enter' && item instanceof HTMLAnchorElement && item.hasAttribute('href')) return
        event.preventDefault()
        activate(event)
        return
      }
      case 'ArrowRight': {
        if (hasModifier) return
        event.preventDefault()
        if (!hasSubTree) return
        if (expanded) getFirstChildItem(item)?.focus()
        else setExpanded(true)
        return
      }
      case 'ArrowLeft': {
        if (hasModifier) return
        if (hasSubTree && expanded) {
          event.preventDefault()
          setExpanded(false)
          return
        }
        const parentItem = getParentItem(item)
        if (!parentItem) return
        event.preventDefault()
        parentItem.focus()
        return
      }
      case 'Backspace': {
        const parentItem = getParentItem(item)
        if (!parentItem) return
        event.preventDefault()
        parentItem.focus()
        return
      }
      case 'u':
      case 'U': {
        if (!actions || !event.shiftKey || !(event.metaKey || event.ctrlKey)) return
        event.preventDefault()
        if (actions.length === 1) actions[0].onClick()
        else setActionDialog('open')
        return
      }
    }
  }

  // Clicks bubble from child items, from the action buttons and from dialogs portalled out of the row. Only clicks
  // on the item's own row activate it.
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || !(event.target instanceof Element)) return
    const owner = event.target.closest(ITEM_PART_SELECTOR)
    if (owner?.getAttribute('data-component') === 'TreeView.Toggle') {
      if (owner.closest('[role="treeitem"]') !== event.currentTarget) return
      // The chevron only toggles, so it must not follow an item that is a link.
      event.preventDefault()
      setExpanded(!expanded)
      return
    }
    if (owner === event.currentTarget) activate(event)
  }

  const handleAuxClick = (event: React.MouseEvent<HTMLElement>) => {
    onAuxClick?.(event)
    if (event.defaultPrevented || event.button !== 1 || !onSelect || !(event.target instanceof Element)) return
    if (event.target.closest(ITEM_PART_SELECTOR) === event.currentTarget) onSelect(event)
  }

  const hasLeadingAction = leadingActionElement !== undefined
  const rowStyle: React.CSSProperties & Record<'--tree-level', number> = {
    '--tree-level': level,
    contentVisibility: containIntrinsicSize ? 'auto' : undefined,
    containIntrinsicSize,
  }

  const row = (
    <div
      className={cn(
        'relative grid min-h-[var(--tree-min-item-height)] w-full rounded-md text-default [overflow-clip-margin:var(--base-size-8)]',
        hasLeadingAction ? '[--tree-leading-action-width:1.5rem]' : '[--tree-leading-action-width:0px]',
        flat
          ? 'grid-cols-[0_var(--tree-leading-action-width)_0_minmax(0,1fr)_auto]'
          : 'grid-cols-[calc((var(--tree-level)-1)*var(--tree-toggle-width)/2)_var(--tree-leading-action-width)_var(--tree-toggle-width)_minmax(0,1fr)_auto]',
        '[[role=treeitem]:focus-visible>&]:shadow-[inset_0_0_0_var(--borderWidth-thick)_var(--fgColor-accent)]',
        'forced-colors:[[role=treeitem]:focus-visible>&]:outline-2 forced-colors:[[role=treeitem]:focus-visible>&]:outline-offset-[-2px] forced-colors:[[role=treeitem]:focus-visible>&]:outline-[HighlightText]',
        isLoadingPlaceholder
          ? 'cursor-default'
          : 'cursor-pointer forced-colors:hover:outline-2 forced-colors:hover:outline-offset-[-2px] forced-colors:hover:outline-transparent',
        !isLoadingPlaceholder && !current && 'hover:bg-[var(--control-transparent-bgColor-hover)]',
        current &&
          'bg-[var(--control-transparent-bgColor-selected)] after:absolute after:top-[calc(50%-0.75rem)] after:-left-2 after:h-6 after:w-1 after:rounded-md after:bg-[var(--fgColor-accent)] forced-colors:after:bg-[HighlightText]',
      )}
      style={rowStyle}
    >
      {!flat && level > 1 ? (
        <div aria-hidden="true" className="col-start-1 row-start-1 flex">
          {Array.from({length: level - 1}, (_, index) => (
            <div
              key={index}
              className="h-full w-full border-r border-[color:var(--tree-line-color,var(--borderColor-muted))]"
            />
          ))}
        </div>
      ) : null}
      {leadingActionElement}
      {hasSubTree && !flat ? (
        // The chevron is for pointers only: keyboard users expand with the arrow keys, so it is not a tab stop.
        <div
          data-component="TreeView.Toggle"
          className={cn(
            'col-start-3 row-start-1 flex h-full items-start justify-center pt-[calc(var(--tree-min-item-height)/2-6px)] text-muted',
            onSelect && 'hover:bg-[var(--control-transparent-bgColor-hover)]',
            level === 1 && 'rounded-l-md',
          )}
        >
          {expanded ? <ChevronDownIcon size={12} /> : <ChevronRightIcon size={12} />}
        </div>
      ) : null}
      <div className="col-start-4 row-start-1 flex min-w-0 items-start gap-2 px-2 py-[calc((var(--tree-min-item-height)-var(--custom-line-height,1.3rem))/2)] leading-[var(--custom-line-height,var(--text-body-lineHeight-medium,1.4285))]">
        {leadingVisualElement}
        <span id={labelId} className={cn('min-w-0 flex-1', truncate ? 'truncate' : 'break-words')}>
          {label}
        </span>
        {trailingVisualElement}
      </div>
      {actions ? (
        <>
          <TrailingAction actions={actions} id={trailingActionId} itemRef={itemRef} shortcutText={shortcutText} />
          {actionDialog === null ? null : (
            <ActionDialog
              actions={actions}
              itemRef={itemRef}
              open={actionDialog === 'open'}
              onOpenChange={open => setActionDialog(open ? 'open' : 'closed')}
            />
          )}
        </>
      ) : null}
    </div>
  )

  const itemProps = {
    ...props,
    id,
    role: 'treeitem',
    tabIndex: isTabStop ? 0 : -1,
    'aria-current': current || undefined,
    'aria-describedby': describedBy,
    'aria-expanded': controlledExpanded === null || !hasSubTree || (isSubTreeEmpty && !expanded) ? undefined : expanded,
    'aria-label': actions && ariaLabel ? `${ariaLabel}. ${shortcutText}` : ariaLabel,
    'aria-labelledby': ariaLabel ? undefined : actions ? `${labelledBy} ${trailingActionId}` : labelledBy,
    'aria-level': level,
    // A polymorphic item sits beside its group rather than containing it, so it claims the group explicitly.
    'aria-owns': isPolymorphic && hasSubTree && expanded ? groupId : undefined,
    'data-component': 'TreeView.Item',
    'data-current': current || undefined,
    'data-expanded': hasSubTree ? expanded : undefined,
    'data-has-leading-action': hasLeadingAction || undefined,
    'data-loading': isLoadingPlaceholder || undefined,
    className: cn('list-none outline-none [overflow-clip-margin:var(--base-size-8)]', className),
    onAuxClick: handleAuxClick,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  }

  return (
    <TreeItemContext.Provider
      value={{
        ariaLabel,
        expanded,
        groupId,
        itemId: id,
        itemRef,
        labelledBy,
        leadingVisualId,
        level,
        setExpanded,
        trailingVisualId,
      }}
    >
      {isPolymorphic ? (
        <li role="none" className="list-none">
          <Component {...itemProps} ref={mergedRef}>
            {row}
          </Component>
          {subTreeElement}
        </li>
      ) : (
        <li {...itemProps} ref={mergedRef}>
          {row}
          {subTreeElement}
        </li>
      )}
    </TreeItemContext.Provider>
  )
})

// ----------------------------------------------------------------------------
// Secondary actions

type TrailingActionProps = {
  actions: TreeViewSecondaryActions[]
  id: string
  itemRef: React.RefObject<HTMLElement | null>
  shortcutText: string
}

/**
 * Pointer access to an item's secondary actions. The buttons are hidden from assistive technology and skipped by Tab,
 * because keyboard and screen reader users reach the same actions through the shortcut named in the item's label.
 */
function TrailingAction({actions, id, itemRef, shortcutText}: TrailingActionProps) {
  const focusItem = () => itemRef.current?.focus()
  return (
    <>
      <div id={id} className="sr-only">
        - {shortcutText}
      </div>
      <div
        aria-hidden="true"
        data-component="TreeView.TrailingAction"
        className="col-start-5 row-start-1 flex text-muted [&>*]:shrink"
      >
        {actions.map(({className, count, icon, label, onClick}) =>
          count === undefined ? (
            <IconButton
              key={label}
              aria-label={label}
              className={className}
              icon={icon}
              tabIndex={-1}
              variant="invisible"
              onClick={onClick}
              onKeyDown={focusItem}
            />
          ) : (
            <Tooltip key={label}>
              <Tooltip.Trigger
                render={
                  <Button
                    aria-label={label}
                    className={className}
                    count={count}
                    leadingVisual={isIconComponent(icon) ? icon : <>{icon}</>}
                    tabIndex={-1}
                    variant="invisible"
                    onClick={onClick}
                    onKeyDown={focusItem}
                  />
                }
              />
              <Tooltip.Content>{label}</Tooltip.Content>
            </Tooltip>
          ),
        )}
      </div>
    </>
  )
}

type ActionDialogProps = {
  actions: TreeViewSecondaryActions[]
  itemRef: React.RefObject<HTMLElement | null>
  onOpenChange: (open: boolean) => void
  open: boolean
}

function ActionDialog({actions, itemRef, onOpenChange, open}: ActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={next => onOpenChange(next)}>
      <Dialog.Content finalFocus={itemRef}>
        <Dialog.Header>
          <Dialog.Title>Supplemental actions</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>
          <ActionList>
            {actions.map(({count, icon, label, onClick}) => (
              <ActionList.Item
                key={label}
                onSelect={() => {
                  onOpenChange(false)
                  onClick()
                }}
              >
                <ActionList.LeadingVisual>{renderIcon(icon)}</ActionList.LeadingVisual>
                {label}
                {count === undefined ? null : (
                  <ActionList.TrailingVisual>
                    {count}
                    <VisuallyHidden> items</VisuallyHidden>
                  </ActionList.TrailingVisual>
                )}
              </ActionList.Item>
            ))}
          </ActionList>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  )
}

// ----------------------------------------------------------------------------
// TreeView.SubTree

export type SubTreeState = 'initial' | 'loading' | 'done' | 'error'

export interface TreeViewSubTreeProps extends Omit<React.ComponentPropsWithoutRef<'ul'>, 'data-component'> {
  /** Number of placeholder rows to show while the subtree loads. Without it, a spinner row is shown. */
  count?: number
  /**
   * Loading state of the subtree. `loading` shows placeholders and announces the load; moving from `loading` to
   * `done` announces the result and moves focus from a focused placeholder to the first loaded item.
   */
  state?: SubTreeState
}

const SubTree = React.forwardRef<HTMLUListElement, TreeViewSubTreeProps>(function TreeViewSubTree(
  {'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, children, className, count, id, state, ...props},
  ref,
) {
  const tree = React.useContext(TreeViewContext)
  const item = React.useContext(TreeItemContext)
  if (!tree || !item) throw new Error('TreeView.SubTree must be rendered within TreeView.Item')
  const {announce} = tree
  const {ariaLabel: itemLabel, expanded, groupId, itemRef, labelledBy} = item
  const previousState = React.useRef(state)
  const loadingFocused = React.useRef(false)
  const isEmpty = (state === undefined || state === 'done') && React.Children.toArray(children).length === 0

  React.useEffect(() => {
    const previous = previousState.current
    previousState.current = state
    const element = itemRef.current
    if (!element || previous === state) return
    const name = getLabelText(element, itemLabel, labelledBy)
    if (state === 'loading') {
      announce(`${name} content loading`)
      return
    }
    if (previous !== 'loading' || state !== 'done') return
    announce(isEmpty ? `${name} is empty` : `${name} content loaded`)
    if (!loadingFocused.current) return
    // Focus was on the placeholder that just unmounted, so hand it to the first loaded item.
    loadingFocused.current = false
    const timeout = window.setTimeout(() => {
      const target = isEmpty ? element : (getFirstChildItem(element) ?? element)
      target.focus()
    })
    return () => window.clearTimeout(timeout)
  }, [announce, isEmpty, itemLabel, itemRef, labelledBy, state])

  if (!expanded) return null

  const groupLabel = ariaLabel ?? (ariaLabelledby ? undefined : itemLabel)

  return (
    <ul
      {...props}
      ref={ref}
      id={id ?? groupId}
      role="group"
      aria-label={groupLabel}
      aria-labelledby={groupLabel ? undefined : (ariaLabelledby ?? labelledBy)}
      data-component="TreeView.SubTree"
      data-state={state}
      className={cn('m-0 list-none p-0', className)}
    >
      {state === 'loading' ? (
        <LoadingItem
          count={count}
          onFocus={() => {
            loadingFocused.current = true
          }}
          onBlur={event => {
            // Unmounting blurs without a destination; only a move elsewhere means the user left the placeholder.
            if (event.relatedTarget) loadingFocused.current = false
          }}
        />
      ) : (
        children
      )}
      {isEmpty ? <EmptyItem /> : null}
    </ul>
  )
})

const SKELETON_WIDTHS = ['67%', '47%', '73%', '64%', '50%']

type LoadingItemProps = Pick<React.HTMLAttributes<HTMLElement>, 'onBlur' | 'onFocus'> & {count?: number}

function LoadingItem({count, ...props}: LoadingItemProps) {
  const id = React.useId()
  return (
    <LoadingPlaceholderContext.Provider value>
      {count ? (
        <Item {...props} id={id}>
          {Array.from({length: count}, (_, index) => (
            <span key={index} aria-hidden="true" className="flex h-8 items-center gap-2 pointer-coarse:h-11">
              <SkeletonAvatar size={16} square />
              <SkeletonText style={{width: SKELETON_WIDTHS[index % SKELETON_WIDTHS.length]}} />
            </span>
          ))}
          <VisuallyHidden>Loading {count} items</VisuallyHidden>
        </Item>
      ) : (
        <Item {...props} id={id}>
          <LeadingVisual>
            <Spinner size="small" />
          </LeadingVisual>
          <span className="text-muted">Loading...</span>
        </Item>
      )}
    </LoadingPlaceholderContext.Provider>
  )
}

function EmptyItem() {
  const id = React.useId()
  return (
    <Item id={id} expanded={null}>
      <span className="text-muted">No items found</span>
    </Item>
  )
}

// ----------------------------------------------------------------------------
// TreeView.ErrorDialog

export interface TreeViewErrorDialogProps {
  /** Description of the error. */
  children: React.ReactNode
  /**
   * Title of the dialog.
   * @default 'Error'
   */
  title?: string
  /** Called when the user chooses to retry loading the subtree. */
  onRetry?: () => void
  /** Called when the user dismisses the error, after the item collapses. */
  onDismiss?: () => void
}

/** Reports a subtree that failed to load. Render it inside the `TreeView.SubTree` whose `state` is `error`. */
function ErrorDialog({children, onDismiss, onRetry, title = 'Error'}: TreeViewErrorDialogProps) {
  const item = React.useContext(TreeItemContext)
  if (!item) throw new Error('TreeView.ErrorDialog must be rendered within TreeView.SubTree')
  const {itemRef, setExpanded} = item
  // Dismissing collapses the item, which unmounts the dialog before it can restore focus itself.
  const focusItem = () => window.setTimeout(() => itemRef.current?.focus())

  return (
    <ConfirmationDialog
      defaultOpen
      title={title}
      description={children}
      confirmButtonContent="Retry"
      cancelButtonContent="Dismiss"
      finalFocus={itemRef}
      onConfirm={() => {
        onRetry?.()
        focusItem()
      }}
      onCancel={() => {
        setExpanded(false)
        onDismiss?.()
        focusItem()
      }}
    />
  )
}

// ----------------------------------------------------------------------------
// Visuals and actions

export interface TreeViewVisualProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children' | 'data-component'> {
  children: React.ReactNode | ((state: TreeViewVisualState) => React.ReactNode)
  /** Accessible name for the visual, which is announced as part of the item's description. */
  label?: string
}

// Visuals center within one line of text so they align with single-line labels and stay at the top of wrapped ones.
const visualClassName = 'flex h-[var(--custom-line-height,1.3rem)] shrink-0 items-center text-muted'

function renderContent(children: TreeViewVisualProps['children'], item: TreeItemContextValue | null) {
  return typeof children === 'function' ? children({expanded: item?.expanded ?? false}) : children
}

const LeadingVisual = React.forwardRef<HTMLSpanElement, TreeViewVisualProps>(function TreeViewLeadingVisual(
  {children, className, label, ...props},
  ref,
) {
  const item = React.useContext(TreeItemContext)
  return (
    <span
      {...props}
      ref={ref}
      aria-hidden="true"
      className={cn(visualClassName, className)}
      data-component="TreeView.LeadingVisual"
    >
      {label ? (
        <span id={item?.leadingVisualId} className="sr-only">
          {label}
        </span>
      ) : null}
      {renderContent(children, item)}
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
      aria-hidden="true"
      className={cn(visualClassName, 'ml-auto', className)}
      data-component="TreeView.TrailingVisual"
    >
      {label ? (
        <span id={item?.trailingVisualId} className="sr-only">
          {label}
        </span>
      ) : null}
      {renderContent(children, item)}
    </span>
  )
})

export interface TreeViewLeadingActionProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children' | 'data-component'> {
  /** The action, such as a drag handle button. Accepts a callback to vary it with the item's expanded state. */
  children: React.ReactNode | ((state: TreeViewVisualState) => React.ReactNode)
  /** Text describing the action. Like the action itself, it is hidden from assistive technology. */
  label?: string
}

/**
 * A pointer affordance before the toggle, such as a drag handle. It is hidden from assistive technology and its
 * controls are removed from the tab order, so give keyboard users an equivalent through the item itself.
 */
const LeadingAction = React.forwardRef<HTMLSpanElement, TreeViewLeadingActionProps>(function TreeViewLeadingAction(
  {children, className, label, ...props},
  ref,
) {
  const item = React.useContext(TreeItemContext)
  const containerRef = React.useRef<HTMLSpanElement | null>(null)
  const mergedRef = React.useMemo(() => mergeRefs(ref, containerRef), [ref])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    for (const element of container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) element.tabIndex = -1
  })

  return (
    <span
      {...props}
      ref={mergedRef}
      aria-hidden="true"
      data-component="TreeView.LeadingAction"
      className={cn('col-start-2 row-start-1 flex text-muted [&>button]:shrink', className)}
    >
      {label ? <span className="sr-only">{label}</span> : null}
      {renderContent(children, item)}
    </span>
  )
})

// ----------------------------------------------------------------------------
// TreeView.DirectoryIcon

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

export const TreeView = Object.assign(Root, {
  DirectoryIcon,
  ErrorDialog,
  Item,
  LeadingAction,
  LeadingVisual,
  SubTree,
  TrailingVisual,
})

Root.displayName = 'TreeView'
Item.displayName = 'TreeView.Item'
SubTree.displayName = 'TreeView.SubTree'
LeadingAction.displayName = 'TreeView.LeadingAction'
LeadingVisual.displayName = 'TreeView.LeadingVisual'
TrailingVisual.displayName = 'TreeView.TrailingVisual'
DirectoryIcon.displayName = 'TreeView.DirectoryIcon'
// An expando on a function declaration would make `typeof TreeView` unnameable in consumers' declaration files.
;(ErrorDialog as {displayName?: string}).displayName = 'TreeView.ErrorDialog'
