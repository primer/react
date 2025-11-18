import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileDirectoryFillIcon,
  FileDirectoryOpenFillIcon,
  type Icon,
} from '@primer/octicons-react'
import {clsx} from 'clsx'
import React, {useCallback, useEffect} from 'react'
import classes from './TreeView.module.css'
import {ConfirmationDialog} from '../ConfirmationDialog/ConfirmationDialog'
import Spinner from '../Spinner'
import Text from '../Text'
import VisuallyHidden from '../_VisuallyHidden'
import {useControllableState} from '../hooks/useControllableState'
import {useId} from '../hooks/useId'
import useSafeTimeout from '../hooks/useSafeTimeout'
import {useSlots} from '../hooks/useSlots'
import {getAccessibleName} from './shared'
import {getFirstChildElement, useRovingTabIndex} from './useRovingTabIndex'
import {useTypeahead} from './useTypeahead'
import {SkeletonAvatar} from '../SkeletonAvatar'
import {SkeletonText} from '../SkeletonText'
import {Dialog} from '../Dialog/Dialog'
import {Button, IconButton} from '../Button'
import {ActionList} from '../ActionList'
import {getAccessibleKeybindingHintString} from '../KeybindingHint'
import {useIsMacOS} from '../hooks'
import {Tooltip} from '../TooltipV2'
import {isSlot} from '../utils/is-slot'
import type {FCWithSlotMarker} from '../utils/types'

// ----------------------------------------------------------------------------
// Context

const RootContext = React.createContext<{
  announceUpdate: (message: string) => void
  // We cache the expanded state of tree items so we can preserve the state
  // across remounts. This is necessary because we unmount tree items
  // when their parent is collapsed.
  expandedStateCache: React.RefObject<Map<string, boolean> | null>
}>({
  announceUpdate: () => {},
  expandedStateCache: {current: new Map()},
})

const ItemContext = React.createContext<{
  itemId: string
  level: number
  isSubTreeEmpty: boolean
  setIsSubTreeEmpty: React.Dispatch<React.SetStateAction<boolean>>
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean) => void
  leadingVisualId: string
  trailingVisualId: string
  trailingActionId: string
}>({
  itemId: '',
  level: 1,
  isSubTreeEmpty: false,
  setIsSubTreeEmpty: () => {},
  isExpanded: false,
  setIsExpanded: () => {},
  leadingVisualId: '',
  trailingVisualId: '',
  trailingActionId: '',
})

// ----------------------------------------------------------------------------
// TreeView

export type TreeViewProps = {
  'aria-label'?: React.AriaAttributes['aria-label']
  'aria-labelledby'?: React.AriaAttributes['aria-labelledby']
  children: React.ReactNode
  flat?: boolean
  truncate?: boolean
  className?: string
  style?: React.CSSProperties
}

export type TreeViewSecondaryActions = {
  label: string
  onClick: () => void
  icon: Icon
  count?: number | string
  className?: string
}

/* Size of toggle icon in pixels. */
const TOGGLE_ICON_SIZE = 12

const Root: React.FC<TreeViewProps> = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  flat,
  truncate = true,
  className,
  style,
}) => {
  const containerRef = React.useRef<HTMLUListElement>(null)
  const mouseDownRef = React.useRef<boolean>(false)
  const [ariaLiveMessage, setAriaLiveMessage] = React.useState('')
  const announceUpdate = React.useCallback((message: string) => {
    setAriaLiveMessage(message)
  }, [])

  const onMouseDown = useCallback(() => {
    mouseDownRef.current = true
  }, [])

  useEffect(() => {
    function onMouseUp() {
      mouseDownRef.current = false
    }
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  useRovingTabIndex({containerRef, mouseDownRef})
  useTypeahead({
    containerRef,
    onFocusChange: element => {
      if (element instanceof HTMLElement) {
        element.focus()
      }
    },
  })

  const expandedStateCache = React.useRef<Map<string, boolean> | null>(null)

  if (expandedStateCache.current === null) {
    expandedStateCache.current = new Map()
  }

  return (
    <RootContext.Provider
      value={{
        announceUpdate,
        expandedStateCache,
      }}
    >
      <>
        <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
          {ariaLiveMessage}
        </VisuallyHidden>
        <ul
          ref={containerRef}
          role="tree"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          data-omit-spacer={flat}
          data-truncate-text={truncate || false}
          onMouseDown={onMouseDown}
          className={clsx(className, classes.TreeViewRootUlStyles)}
          style={style}
        >
          {children}
        </ul>
      </>
    </RootContext.Provider>
  )
}

Root.displayName = 'TreeView'

// ----------------------------------------------------------------------------
// TreeView.Item

export type TreeViewItemProps = {
  'aria-label'?: React.AriaAttributes['aria-label']
  'aria-labelledby'?: React.AriaAttributes['aria-labelledby']
  id: string
  children: React.ReactNode
  containIntrinsicSize?: string
  current?: boolean
  defaultExpanded?: boolean
  expanded?: boolean | null
  onExpandedChange?: (expanded: boolean) => void
  onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
  className?: string
  secondaryActions?: TreeViewSecondaryActions[]
}

const Item = React.forwardRef<HTMLElement, TreeViewItemProps>(
  (
    {
      id: itemId,
      containIntrinsicSize,
      current: isCurrentItem = false,
      defaultExpanded,
      expanded,
      onExpandedChange,
      onSelect,
      children,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      secondaryActions,
    },
    ref,
  ) => {
    const [slots, rest] = useSlots(children, {
      leadingAction: LeadingAction,
      leadingVisual: LeadingVisual,
      trailingVisual: TrailingVisual,
    })
    const {expandedStateCache} = React.useContext(RootContext)
    const labelId = useId()
    const leadingVisualId = useId()
    const trailingVisualId = useId()
    const trailingActionId = useId()

    const [isExpanded, setIsExpanded] = useControllableState({
      name: itemId,
      // If the item was previously mounted, its expanded state might be cached.
      // We check the cache first, and then fall back to the defaultExpanded prop.
      // If defaultExpanded is not provided, we default to false unless the item
      // is the current item, in which case we default to true.
      defaultValue: () => expandedStateCache.current?.get(itemId) ?? defaultExpanded ?? isCurrentItem,
      value: expanded === null ? false : expanded,
      onChange: onExpandedChange,
    })
    const {level} = React.useContext(ItemContext)
    const {hasSubTree, subTree, childrenWithoutSubTree} = useSubTree(rest)
    const [isSubTreeEmpty, setIsSubTreeEmpty] = React.useState(!hasSubTree)
    const [actionCommandPressed, setActionCommandPressed] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const isMacOS = useIsMacOS()

    // Set the expanded state and cache it
    const setIsExpandedWithCache = React.useCallback(
      // eslint-disable-next-line react-hooks/preserve-manual-memoization
      (newIsExpanded: boolean) => {
        setIsExpanded(newIsExpanded)
        expandedStateCache.current?.set(itemId, newIsExpanded)
      },
      [itemId, setIsExpanded, expandedStateCache],
    )

    // Expand or collapse the subtree
    const toggle = React.useCallback(
      (event?: React.MouseEvent | React.KeyboardEvent) => {
        setIsExpandedWithCache(!isExpanded)
        event?.stopPropagation()
      },
      [isExpanded, setIsExpandedWithCache],
    )

    const activateActionsDialog = React.useCallback(() => {
      if (!secondaryActions) return

      if (secondaryActions.length > 1) {
        // If there are multiple secondary actions, open the action dialog
        // as this allows users to select the action they want to interact with.
        setActionCommandPressed(true)
      } else {
        // If there is only one secondary action, trigger it directly
        const action = secondaryActions[0].onClick
        action()
      }
    }, [secondaryActions])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        switch (event.key) {
          case 'Enter':
          case ' ':
            if (onSelect) {
              onSelect(event)
            } else {
              toggle(event)
            }
            event.stopPropagation()
            break
          case 'ArrowRight':
            // Ignore if modifier keys are pressed
            if (event.altKey || event.metaKey) return
            event.preventDefault()
            event.stopPropagation()
            setIsExpandedWithCache(true)
            break
          case 'ArrowLeft':
            // Ignore if modifier keys are pressed
            if (event.altKey || event.metaKey) return
            event.preventDefault()
            event.stopPropagation()
            setIsExpandedWithCache(false)
            break
          case 'U':
          case 'u':
            if (!(event.shiftKey && (event.metaKey || event.ctrlKey))) return
            activateActionsDialog()
            break
        }
      },
      [onSelect, setIsExpandedWithCache, toggle, activateActionsDialog],
    )

    const ariaDescribedByIds = [
      slots.leadingVisual ? leadingVisualId : null,
      slots.trailingVisual ? trailingVisualId : null,
    ].filter(Boolean)

    const shortcut = `Shift+${isMacOS ? 'Meta' : 'Control'}+U`
    const trailingActionShortcutText = `Press (${getAccessibleKeybindingHintString(shortcut, isMacOS)}) for more actions.`

    return (
      <ItemContext.Provider
        value={{
          itemId,
          level: level + 1,
          isSubTreeEmpty,
          setIsSubTreeEmpty,
          isExpanded,
          setIsExpanded: setIsExpandedWithCache,
          leadingVisualId,
          trailingVisualId,
          trailingActionId,
        }}
      >
        {/* @ts-ignore Box doesn't have type support for `ref` used in combination with `as` */}
        <li
          className={clsx('PRIVATE_TreeView-item', className, classes.TreeViewItem)}
          ref={ref as React.ForwardedRef<HTMLLIElement>}
          tabIndex={0}
          id={itemId}
          role="treeitem"
          aria-label={
            secondaryActions ? (ariaLabel ? `${ariaLabel}. ${trailingActionShortcutText}` : undefined) : ariaLabel
          }
          aria-labelledby={
            ariaLabel ? undefined : `${ariaLabelledby || labelId} ${secondaryActions ? trailingActionId : ''}`.trim()
          }
          aria-describedby={ariaDescribedByIds.length ? ariaDescribedByIds.join(' ') : undefined}
          aria-level={level}
          aria-expanded={(isSubTreeEmpty && (!isExpanded || !hasSubTree)) || expanded === null ? undefined : isExpanded}
          aria-current={isCurrentItem ? 'true' : undefined}
          aria-selected={isFocused ? 'true' : 'false'}
          data-has-leading-action={slots.leadingAction ? true : undefined}
          onKeyDown={handleKeyDown}
          onFocus={event => {
            // Scroll the first child into view when the item receives focus
            event.currentTarget.firstElementChild?.scrollIntoView({block: 'nearest', inline: 'nearest'})

            // Set the focused state
            setIsFocused(true)

            // Prevent focus event from bubbling up to parent items
            event.stopPropagation()
          }}
          onBlur={() => setIsFocused(false)}
          onClick={event => {
            if (onSelect) {
              onSelect(event)
            } else {
              toggle(event)
            }
            event.stopPropagation()
          }}
          onAuxClick={event => {
            if (onSelect && event.button === 1) {
              onSelect(event)
            }
            event.stopPropagation()
          }}
        >
          <div
            className={clsx('PRIVATE_TreeView-item-container', classes.TreeViewItemContainer)}
            style={{
              // @ts-ignore CSS custom property
              '--level': level,
              contentVisibility: containIntrinsicSize ? 'auto' : undefined,
              containIntrinsicSize,
            }}
          >
            <div style={{gridArea: 'spacer', display: 'flex'}}>
              <LevelIndicatorLines level={level} />
            </div>
            {slots.leadingAction}
            {hasSubTree ? (
              // This lint rule is disabled due to the guidelines in the `TreeView` api docs.
              // https://github.com/github/primer/blob/main/apis/tree-view-api.md#the-expandcollapse-chevron-toggle
              // This has specific advice that the chevron be available only to pointer event.
              // If they take up a button role, they become unnecessary and numerous tab stops.

              <div
                className={clsx(
                  'PRIVATE_TreeView-item-toggle',
                  onSelect && 'PRIVATE_TreeView-item-toggle--hover',
                  level === 1 && 'PRIVATE_TreeView-item-toggle--end',
                  classes.TreeViewItemToggle,
                  classes.TreeViewItemToggleHover,
                  classes.TreeViewItemToggleEnd,
                )}
                onClick={event => {
                  if (onSelect) {
                    toggle(event)
                  }
                }}
              >
                {isExpanded ? (
                  <ChevronDownIcon size={TOGGLE_ICON_SIZE} />
                ) : (
                  <ChevronRightIcon size={TOGGLE_ICON_SIZE} />
                )}
              </div>
            ) : null}
            <div id={labelId} className={clsx('PRIVATE_TreeView-item-content', classes.TreeViewItemContent)}>
              {slots.leadingVisual}
              <span className={clsx('PRIVATE_TreeView-item-content-text', classes.TreeViewItemContentText)}>
                {childrenWithoutSubTree}
              </span>
              {slots.trailingVisual}
            </div>
            {secondaryActions ? (
              <>
                <TrailingAction items={secondaryActions} shortcutText={trailingActionShortcutText} />
                {actionCommandPressed ? (
                  <ActionDialog items={secondaryActions} onClose={() => setActionCommandPressed(false)} />
                ) : null}
              </>
            ) : null}
          </div>
          {subTree}
        </li>
      </ItemContext.Provider>
    )
  },
)

/** Lines to indicate the depth of an item in a TreeView */
const LevelIndicatorLines: React.FC<{level: number}> = ({level}) => {
  return (
    <div style={{width: '100%', display: 'flex'}}>
      {Array.from({length: level - 1}).map((_, index) => (
        <div key={index} className={clsx('PRIVATE_TreeView-item-level-line', classes.TreeViewItemLevelLine)} />
      ))}
    </div>
  )
}

Item.displayName = 'TreeView.Item'

// ----------------------------------------------------------------------------
// TreeView.SubTree

export type SubTreeState = 'initial' | 'loading' | 'done' | 'error'

export type TreeViewSubTreeProps = {
  children?: React.ReactNode
  state?: SubTreeState
  /**
   * Display a skeleton loading state with the specified count of items
   */
  count?: number
  'aria-label'?: string
}

const SubTree: FCWithSlotMarker<TreeViewSubTreeProps> = ({count, state, children, 'aria-label': ariaLabel}) => {
  const {announceUpdate} = React.useContext(RootContext)
  const {itemId, isExpanded, isSubTreeEmpty, setIsSubTreeEmpty} = React.useContext(ItemContext)
  const loadingItemRef = React.useRef<HTMLElement>(null)
  const ref = React.useRef<HTMLElement>(null)
  const [loadingFocused, setLoadingFocused] = React.useState(false)
  const [subTreeLabel, setSubTreeLabel] = React.useState('')
  const previousState = usePreviousValue(state)
  const {safeSetTimeout} = useSafeTimeout()

  React.useEffect(() => {
    // If `state` is undefined, we're working in a synchronous context and need
    // to detect if the sub-tree has content. If `state === 'done` then we're
    // working in an asynchronous context and need to see if there is content
    // that has been loaded in.
    if (state === undefined || state === 'done') {
      if (!isSubTreeEmpty && !children) {
        setIsSubTreeEmpty(true)
      } else if (isSubTreeEmpty && children) {
        setIsSubTreeEmpty(false)
      }
    }
  }, [state, isSubTreeEmpty, setIsSubTreeEmpty, children])

  // Handle transition from loading to done state
  React.useEffect(() => {
    const parentElement = document.getElementById(itemId)
    if (!parentElement) return

    setSubTreeLabel(getAccessibleName(parentElement))
    if (previousState === 'loading' && state === 'done') {
      // Announce update to screen readers
      const parentName = getAccessibleName(parentElement)

      if (ref.current?.childElementCount) {
        announceUpdate(`${parentName} content loaded`)
      } else {
        announceUpdate(`${parentName} is empty`)
      }

      // Move focus to the first child if the loading indicator
      // was focused when the async items finished loading
      if (loadingFocused) {
        const firstChild = getFirstChildElement(parentElement)

        if (firstChild) {
          safeSetTimeout(() => {
            firstChild.focus()
          })
        } else {
          safeSetTimeout(() => {
            parentElement.focus()
          })
        }

        setLoadingFocused(false)
      }
    } else if (state === 'loading') {
      const parentName = getAccessibleName(parentElement)
      announceUpdate(`${parentName} content loading`)
    }
  }, [loadingFocused, previousState, state, itemId, announceUpdate, ref, safeSetTimeout])

  // Track focus on the loading indicator
  React.useEffect(() => {
    function handleFocus() {
      setLoadingFocused(true)
    }

    function handleBlur(event: FocusEvent) {
      // Skip blur events that are caused by the element being removed from the DOM.
      // This can happen when the loading indicator is focused when async items are
      // done loading and the loading indicator is removed from the DOM.
      // If `loadingFocused` is `true` when `state` is `"done"` then the loading indicator
      // was focused when the async items finished loading and we need to move focus to the
      // first child.
      if (!event.relatedTarget) return

      setLoadingFocused(false)
    }

    const loadingElement = loadingItemRef.current
    if (!loadingElement) return

    loadingElement.addEventListener('focus', handleFocus)
    loadingElement.addEventListener('blur', handleBlur)

    return () => {
      loadingElement.removeEventListener('focus', handleFocus)
      loadingElement.removeEventListener('blur', handleBlur)
    }
  }, [loadingItemRef, state])

  if (!isExpanded) {
    return null
  }

  return (
    <ul
      role="group"
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}
      // @ts-ignore Box doesn't have type support for `ref` used in combination with `as`
      ref={ref}
      aria-label={ariaLabel || subTreeLabel}
    >
      {state === 'loading' ? <LoadingItem ref={loadingItemRef} count={count} /> : children}
      {isSubTreeEmpty && state !== 'loading' ? <EmptyItem /> : null}
    </ul>
  )
}

SubTree.displayName = 'TreeView.SubTree'
SubTree.__SLOT__ = Symbol('TreeView.SubTree')

function usePreviousValue<T>(value: T): T {
  const ref = React.useRef(value)

  React.useEffect(() => {
    ref.current = value
  }, [value])

  // eslint-disable-next-line react-hooks/refs
  return ref.current
}

const SkeletonItem = () => {
  return (
    <span
      className={clsx(
        classes.TreeViewSkeletonItemContainerStyle,
        classes.TreeViewItemSkeleton,
        'PRIVATE_TreeView-item-skeleton',
      )}
    >
      <SkeletonAvatar size={16} square />
      <SkeletonText className={classes.TreeItemSkeletonTextStyles} />
    </span>
  )
}

type LoadingItemProps = {
  count?: number
}

const LoadingItem = React.forwardRef<HTMLElement, LoadingItemProps>(({count}, ref) => {
  const itemId = useId()

  if (count) {
    return (
      <Item id={itemId} ref={ref}>
        {Array.from({length: count}).map((_, i) => {
          return <SkeletonItem aria-hidden={true} key={i} />
        })}
        <div className={clsx('PRIVATE_VisuallyHidden', classes.TreeViewVisuallyHidden)}>Loading {count} items</div>
      </Item>
    )
  }

  return (
    <Item id={itemId} ref={ref}>
      <LeadingVisual>
        <Spinner size="small" />
      </LeadingVisual>
      <Text className="fgColor-muted">Loading...</Text>
    </Item>
  )
})

const EmptyItem = React.forwardRef<HTMLElement>((props, ref) => {
  return (
    <Item expanded={null} id={useId()} ref={ref}>
      <Text className="fgColor-muted">No items found</Text>
    </Item>
  )
})

function useSubTree(children: React.ReactNode) {
  return React.useMemo(() => {
    const subTree = React.Children.toArray(children).find(
      child => React.isValidElement(child) && (child.type === SubTree || isSlot(child, SubTree)),
    )

    const childrenWithoutSubTree = React.Children.toArray(children).filter(
      child => !(React.isValidElement(child) && (child.type === SubTree || isSlot(child, SubTree))),
    )

    return {
      subTree,
      childrenWithoutSubTree,
      hasSubTree: Boolean(subTree),
    }
  }, [children])
}

// ----------------------------------------------------------------------------
// TreeView.LeadingVisual and TreeView.TrailingVisual

export type TreeViewVisualProps = {
  children: React.ReactNode | ((props: {isExpanded: boolean}) => React.ReactNode)
  // Provide an accessible name for the visual. This should provide information
  // about what the visual indicates or represents
  label?: string
}

const LeadingVisual: React.FC<TreeViewVisualProps> = props => {
  const {isExpanded, leadingVisualId} = React.useContext(ItemContext)
  const children = typeof props.children === 'function' ? props.children({isExpanded}) : props.children
  return (
    <>
      <div
        className={clsx('PRIVATE_VisuallyHidden', classes.TreeViewVisuallyHidden)}
        aria-hidden={true}
        id={leadingVisualId}
      >
        {props.label}
      </div>
      <div className={clsx('PRIVATE_TreeView-item-visual', classes.TreeViewItemVisual)} aria-hidden={true}>
        {children}
      </div>
    </>
  )
}

LeadingVisual.displayName = 'TreeView.LeadingVisual'

const TrailingVisual: React.FC<TreeViewVisualProps> = props => {
  const {isExpanded, trailingVisualId} = React.useContext(ItemContext)
  const children = typeof props.children === 'function' ? props.children({isExpanded}) : props.children
  return (
    <>
      <div
        className={clsx('PRIVATE_VisuallyHidden', classes.TreeViewVisuallyHidden)}
        aria-hidden={true}
        id={trailingVisualId}
      >
        {props.label}
      </div>
      <div className={clsx('PRIVATE_TreeView-item-visual', classes.TreeViewItemVisual)} aria-hidden={true}>
        {children}
      </div>
    </>
  )
}

TrailingVisual.displayName = 'TreeView.TrailingVisual'

// ----------------------------------------------------------------------------
// TreeView.LeadingAction

const LeadingAction: React.FC<TreeViewVisualProps> = props => {
  const {isExpanded} = React.useContext(ItemContext)
  const children = typeof props.children === 'function' ? props.children({isExpanded}) : props.children
  return (
    <>
      <div className={clsx('PRIVATE_VisuallyHidden', classes.TreeViewVisuallyHidden)} aria-hidden={true}>
        {props.label}
      </div>
      <div
        className={clsx('PRIVATE_TreeView-item-leading-action', classes.TreeViewItemLeadingAction)}
        aria-hidden={true}
      >
        {children}
      </div>
    </>
  )
}

LeadingAction.displayName = 'TreeView.LeadingAction'
// ----------------------------------------------------------------------------
// TreeView.TrailingAction

export type TreeViewTrailingAction = {
  items: TreeViewSecondaryActions[]
  shortcutText: string
}

const TrailingAction = (props: TreeViewTrailingAction) => {
  const {trailingActionId, itemId} = React.useContext(ItemContext)
  const {items, shortcutText} = props

  return (
    <>
      <div id={trailingActionId} className={clsx('PRIVATE_VisuallyHidden', classes.TreeViewVisuallyHidden)}>
        - {shortcutText}
      </div>
      <div
        className={classes.TreeViewItemTrailingAction}
        aria-hidden={true}
        onClick={event =>
          // Prevent focus event from bubbling up to parent items
          // This is needed to prevent the TreeView from interfering with trailing actions
          event.stopPropagation()
        }
        onKeyDown={event => event.stopPropagation()}
      >
        {items.map(({label, onClick, icon, count, className}, index) => {
          // If there is a count, we render a Button instead of an IconButton,
          // as IconButton doesn't support displaying a count.
          if (count) {
            return (
              <Tooltip key={index} text={label}>
                <Button
                  aria-label={label}
                  leadingVisual={icon}
                  variant="invisible"
                  className={clsx(className, classes.TreeViewItemTrailingActionButton)}
                  onClick={onClick}
                  onKeyDown={() => {
                    // hack to send focus back to the tree item after the action is triggered via click
                    // this is needed because the trailing action shouldn't be focused, as it does not interact well with
                    // the focus management of TreeView
                    const parentElement = document.getElementById(itemId)
                    parentElement?.focus()
                  }}
                  tabIndex={-1}
                  aria-hidden={true}
                  count={count}
                />
              </Tooltip>
            )
          }

          return (
            <IconButton
              icon={icon}
              variant="invisible"
              aria-label={label}
              className={clsx(className, classes.TreeViewItemTrailingActionButton)}
              onClick={onClick}
              tabIndex={-1}
              aria-hidden={true}
              key={index}
              onKeyDown={() => {
                const parentElement = document.getElementById(itemId)
                parentElement?.focus()
              }}
            />
          )
        })}
      </div>
    </>
  )
}

TrailingAction.displayName = 'TreeView.TrailingAction'
// ----------------------------------------------------------------------------
// TreeView.ActionDialog

export type TreeViewActionDialogProps = {
  items: TreeViewSecondaryActions[]
  onClose?: () => void
}

const ActionDialog: React.FC<TreeViewActionDialogProps> = ({items, onClose}) => {
  const {itemId} = React.useContext(ItemContext)
  return (
    <div
      onClick={event => {
        // Prevent click events from bubbling up to the TreeView
        // and interfering with keyboard navigation
        event.stopPropagation()
      }}
      onKeyDown={event => {
        if (['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
          // Prevent keyboard events from bubbling up to the TreeView
          // and interfering with keyboard navigation
          event.stopPropagation()
        }
      }}
    >
      <Dialog
        title="Supplemental actions"
        onClose={() => {
          if (onClose) {
            onClose()
          }

          // Focus parent item after the dialog is closed
          setTimeout(() => {
            const parentElement = document.getElementById(itemId)
            parentElement?.focus()
          })
        }}
      >
        <ActionList>
          {items.map(({label, onClick, icon: Icon, count}, index) => (
            <ActionList.Item key={index} onSelect={onClick}>
              <ActionList.LeadingVisual>
                <Icon />
              </ActionList.LeadingVisual>
              {label}
              {count ? (
                <ActionList.TrailingVisual>
                  {count}
                  <VisuallyHidden>items</VisuallyHidden>
                </ActionList.TrailingVisual>
              ) : null}
            </ActionList.Item>
          ))}
        </ActionList>
      </Dialog>
    </div>
  )
}

ActionDialog.displayName = 'TreeView.ActionDialog'

// ----------------------------------------------------------------------------
// TreeView.DirectoryIcon

const DirectoryIcon = () => {
  const {isExpanded} = React.useContext(ItemContext)
  const Icon = isExpanded ? FileDirectoryOpenFillIcon : FileDirectoryFillIcon
  return (
    <div className={clsx('PRIVATE_TreeView-directory-icon', classes.TreeViewDirectoryIcon)}>
      <Icon />
    </div>
  )
}

// ----------------------------------------------------------------------------
// TreeView.ErrorDialog

export type TreeViewErrorDialogProps = {
  children: React.ReactNode
  title?: string
  onRetry?: () => void
  onDismiss?: () => void
}

const ErrorDialog: React.FC<TreeViewErrorDialogProps> = ({title = 'Error', children, onRetry, onDismiss}) => {
  const {itemId, setIsExpanded} = React.useContext(ItemContext)
  return (
    <div
      onKeyDown={event => {
        if (['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
          // Prevent keyboard events from bubbling up to the TreeView
          // and interfering with keyboard navigation
          event.stopPropagation()
        }
      }}
    >
      <ConfirmationDialog
        title={title}
        onClose={gesture => {
          // Focus parent item after the dialog is closed
          setTimeout(() => {
            const parentElement = document.getElementById(itemId)
            parentElement?.focus()
          })

          if (gesture === 'confirm') {
            onRetry?.()
          } else {
            setIsExpanded(false)
            onDismiss?.()
          }
        }}
        confirmButtonContent="Retry"
        cancelButtonContent="Dismiss"
      >
        {children}
      </ConfirmationDialog>
    </div>
  )
}

ErrorDialog.displayName = 'TreeView.ErrorDialog'

// ----------------------------------------------------------------------------
// Export

export const TreeView = Object.assign(Root, {
  Item,
  SubTree,
  LeadingAction,
  LeadingVisual,
  TrailingVisual,
  DirectoryIcon,
  ErrorDialog,
})
