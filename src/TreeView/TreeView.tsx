import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileDirectoryFillIcon,
  FileDirectoryOpenFillIcon
} from '@primer/octicons-react'
import {useSSRSafeId} from '@react-aria/ssr'
import classnames from 'classnames'
import React from 'react'
import styled, {keyframes} from 'styled-components'
import {get} from '../constants'
import {ConfirmationDialog} from '../Dialog/ConfirmationDialog'
import {useControllableState} from '../hooks/useControllableState'
import useSafeTimeout from '../hooks/useSafeTimeout'
import Spinner from '../Spinner'
import sx, {SxProp} from '../sx'
import Text from '../Text'
import createSlots from '../utils/create-slots'
import VisuallyHidden from '../_VisuallyHidden'
import {getAccessibleName} from './shared'
import {getFirstChildElement, useRovingTabIndex} from './useRovingTabIndex'
import {useTypeahead} from './useTypeahead'

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
  expandedStateCache: {current: new Map()}
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
}>({
  itemId: '',
  level: 1,
  isSubTreeEmpty: false,
  setIsSubTreeEmpty: () => {},
  isExpanded: false,
  setIsExpanded: () => {},
  leadingVisualId: '',
  trailingVisualId: ''
})

// ----------------------------------------------------------------------------
// TreeView

export type TreeViewProps = {
  'aria-label'?: React.AriaAttributes['aria-label']
  'aria-labelledby'?: React.AriaAttributes['aria-labelledby']
  children: React.ReactNode
}

const UlBox = styled.ul<SxProp>`
  list-style: none;
  padding: 0;
  margin: 0;

  /*
   * WARNING: This is a performance optimization.
   *
   * We define styles for the tree items at the root level of the tree
   * to avoid recomputing the styles for each item when the tree updates.
   * We're sacraficing maintainability for performance because TreeView
   * needs to be performant enough to handle large trees (thousands of items). 
   *
   * This is intended to be a temporary solution until we can improve the
   * performance of our styling patterns.
   *
   * Do NOT copy this pattern without understanding the tradeoffs.
   * Do NOT reference PRIVATE_* classnames outside of this file.
   */
  .PRIVATE_TreeView-item {
    outline: none;

    &:focus-visible > div {
      box-shadow: inset 0 0 0 2px ${get(`colors.accent.fg`)};
      @media (forced-colors: active) {
        outline: 2px solid HighlightText;
        outline-offset: -2;
      }
    }
  }

  .PRIVATE_TreeView-item-container {
    --level: 1; /* default level */
    --toggle-width: 1rem; /* 16px */
    position: relative;
    display: grid;
    grid-template-columns: calc(calc(var(--level) - 1) * (var(--toggle-width) / 2)) var(--toggle-width) 1fr;
    grid-template-areas: 'spacer toggle content';
    width: 100%;
    min-height: 2rem; /* 32px */
    font-size: ${get('fontSizes.1')};
    color: ${get('colors.fg.default')};
    border-radius: ${get('radii.2')};
    cursor: pointer;

    &:hover {
      background-color: ${get('colors.actionListItem.default.hoverBg')};

      @media (forced-colors: active) {
        outline: 2px solid transparent;
        outline-offset: -2px;
      }
    }

    @media (pointer: coarse) {
      --toggle-width: 1.5rem; /* 24px */
      min-height: 2.75rem; /* 44px */
    }

    &:has(.PRIVATE_TreeView-item-skeleton):hover {
      background-color: transparent;
      cursor: default;

      @media (forced-colors: active) {
        outline: none;
      }
    }
  }

  .PRIVATE_TreeView-item[aria-current='true'] > .PRIVATE_TreeView-item-container {
    background-color: ${get('colors.actionListItem.default.selectedBg')};

    /* Current item indicator */
    &::after {
      content: '';
      position: absolute;
      top: calc(50% - 0.75rem); /* 50% - 12px */
      left: -${get('space.2')};
      width: 0.25rem; /* 4px */
      height: 1.5rem; /* 24px */
      background-color: ${get('colors.accent.fg')};
      border-radius: ${get('radii.2')};

      @media (forced-colors: active) {
        background-color: HighlightText;
      }
    }
  }

  .PRIVATE_TreeView-item-toggle {
    grid-area: toggle;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${get('colors.fg.muted')};
  }

  .PRIVATE_TreeView-item-toggle--hover:hover {
    background-color: ${get('colors.treeViewItem.chevron.hoverBg')};
  }

  .PRIVATE_TreeView-item-toggle--end {
    border-top-left-radius: ${get('radii.2')};
    border-bottom-left-radius: ${get('radii.2')};
  }

  .PRIVATE_TreeView-item-content {
    grid-area: content;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 ${get('space.2')};
    gap: ${get('space.2')};
  }

  .PRIVATE_TreeView-item-content-text {
    /* Truncate text label */
    flex: 1 1 auto;
    width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .PRIVATE_TreeView-item-visual {
    display: flex;
    color: ${get('colors.fg.muted')};
  }

  .PRIVATE_TreeView-item-level-line {
    width: 100%;
    height: 100%;
    border-right: 1px solid;

    /*
     * On devices without hover, the nesting indicator lines
     * appear at all times.
     */
    border-color: ${get('colors.border.subtle')};
  }

  /*
   * On devices with :hover support, the nesting indicator lines
   * fade in when the user mouses over the entire component,
   * or when there's focus inside the component. This makes
   * sure the component remains simple when not in use.
   */
  @media (hover: hover) {
    .PRIVATE_TreeView-item-level-line {
      border-color: transparent;
    }

    &:hover .PRIVATE_TreeView-item-level-line,
    &:focus-within .PRIVATE_TreeView-item-level-line {
      border-color: ${get('colors.border.subtle')};
    }
  }

  .PRIVATE_TreeView-directory-icon {
    display: grid;
    color: ${get('colors.treeViewItem.directory.fill')};
  }

  .PRIVATE_VisuallyHidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  ${sx}
`

const Root: React.FC<TreeViewProps> = ({'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, children}) => {
  const containerRef = React.useRef<HTMLUListElement>(null)
  const [ariaLiveMessage, setAriaLiveMessage] = React.useState('')
  const announceUpdate = React.useCallback((message: string) => {
    setAriaLiveMessage(message)
  }, [])

  useRovingTabIndex({containerRef})
  useTypeahead({
    containerRef,
    onFocusChange: element => {
      if (element instanceof HTMLElement) {
        element.focus()
      }
    }
  })

  const expandedStateCache = React.useRef<Map<string, boolean> | null>(null)

  if (expandedStateCache.current === null) {
    expandedStateCache.current = new Map()
  }

  return (
    <RootContext.Provider
      value={{
        announceUpdate,
        expandedStateCache
      }}
    >
      <>
        <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
          {ariaLiveMessage}
        </VisuallyHidden>
        <UlBox ref={containerRef} role="tree" aria-label={ariaLabel} aria-labelledby={ariaLabelledby}>
          {children}
        </UlBox>
      </>
    </RootContext.Provider>
  )
}

Root.displayName = 'TreeView'

// ----------------------------------------------------------------------------
// TreeView.Item

export type TreeViewItemProps = {
  id: string
  children: React.ReactNode
  current?: boolean
  defaultExpanded?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
}

const {Slots, Slot} = createSlots(['LeadingVisual', 'TrailingVisual'])

const Item = React.forwardRef<HTMLElement, TreeViewItemProps>(
  (
    {id: itemId, current: isCurrentItem = false, defaultExpanded, expanded, onExpandedChange, onSelect, children},
    ref
  ) => {
    const {expandedStateCache} = React.useContext(RootContext)
    const labelId = useSSRSafeId()
    const leadingVisualId = useSSRSafeId()
    const trailingVisualId = useSSRSafeId()
    const [isExpanded, setIsExpanded] = useControllableState({
      name: itemId,
      // If the item was previously mounted, it's expanded state might be cached.
      // We check the cache first, and then fall back to the defaultExpanded prop.
      // If defaultExpanded is not provided, we default to false unless the item
      // is the current item, in which case we default to true.
      defaultValue: () => expandedStateCache.current?.get(itemId) ?? defaultExpanded ?? isCurrentItem,
      value: expanded,
      onChange: onExpandedChange
    })
    const {level} = React.useContext(ItemContext)
    const {hasSubTree, subTree, childrenWithoutSubTree} = useSubTree(children)
    const [isSubTreeEmpty, setIsSubTreeEmpty] = React.useState(!hasSubTree)

    // Set the expanded state and cache it
    const setIsExpandedWithCache = React.useCallback(
      (newIsExpanded: boolean) => {
        setIsExpanded(newIsExpanded)
        expandedStateCache.current?.set(itemId, newIsExpanded)
      },
      [itemId, setIsExpanded, expandedStateCache]
    )

    // Expand or collapse the subtree
    const toggle = React.useCallback(
      (event?: React.MouseEvent | React.KeyboardEvent) => {
        setIsExpandedWithCache(!isExpanded)
        event?.stopPropagation()
      },
      [isExpanded, setIsExpandedWithCache]
    )

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        switch (event.key) {
          case 'Enter':
            if (onSelect) {
              onSelect(event)
            } else {
              toggle(event)
            }
            break
          case 'ArrowRight':
            event.preventDefault()
            event.stopPropagation()
            setIsExpandedWithCache(true)
            break
          case 'ArrowLeft':
            event.preventDefault()
            event.stopPropagation()
            setIsExpandedWithCache(false)
            break
        }
      },
      [onSelect, setIsExpandedWithCache, toggle]
    )

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
          trailingVisualId
        }}
      >
        {/* @ts-ignore Box doesn't have type support for `ref` used in combination with `as` */}
        <li
          className="PRIVATE_TreeView-item"
          ref={ref as React.ForwardedRef<HTMLLIElement>}
          tabIndex={0}
          id={itemId}
          role="treeitem"
          aria-labelledby={labelId}
          aria-describedby={`${leadingVisualId} ${trailingVisualId}`}
          aria-level={level}
          aria-expanded={isSubTreeEmpty ? undefined : isExpanded}
          aria-current={isCurrentItem ? 'true' : undefined}
          onKeyDown={handleKeyDown}
          onFocus={event => {
            // Scroll the first child into view when the item receives focus
            event.currentTarget.firstElementChild?.scrollIntoView({block: 'nearest', inline: 'nearest'})

            // Prevent focus event from bubbling up to parent items
            event.stopPropagation()
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className="PRIVATE_TreeView-item-container"
            style={{
              // @ts-ignore CSS custom property
              '--level': level
            }}
            onClick={event => {
              if (onSelect) {
                onSelect(event)
              } else {
                toggle(event)
              }
            }}
          >
            <div style={{gridArea: 'spacer', display: 'flex'}}>
              <LevelIndicatorLines level={level} />
            </div>
            {hasSubTree ? (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                className={classnames(
                  'PRIVATE_TreeView-item-toggle',
                  onSelect && 'PRIVATE_TreeView-item-toggle--hover',
                  level === 1 && 'PRIVATE_TreeView-item-toggle--end'
                )}
                onClick={event => {
                  if (onSelect) {
                    toggle(event)
                  }
                }}
              >
                {isExpanded ? <ChevronDownIcon size={12} /> : <ChevronRightIcon size={12} />}
              </div>
            ) : null}
            <div id={labelId} className="PRIVATE_TreeView-item-content">
              <Slots>
                {slots => (
                  <>
                    {slots.LeadingVisual}
                    <span className="PRIVATE_TreeView-item-content-text">{childrenWithoutSubTree}</span>
                    {slots.TrailingVisual}
                  </>
                )}
              </Slots>
            </div>
          </div>
          {subTree}
        </li>
      </ItemContext.Provider>
    )
  }
)

/** Lines to indicate the depth of an item in a TreeView */
const LevelIndicatorLines: React.FC<{level: number}> = ({level}) => {
  return (
    <div style={{width: '100%', display: 'flex'}}>
      {Array.from({length: level - 1}).map((_, index) => (
        <div key={index} className="PRIVATE_TreeView-item-level-line" />
      ))}
    </div>
  )
}

Item.displayName = 'TreeView.Item'

// ----------------------------------------------------------------------------
// TreeView.LinkItem

export type TreeViewLinkItemProps = TreeViewItemProps & {
  href?: string
}

// TODO: Use an <a> element to enable native browser behavior like opening links in a new tab
const LinkItem = React.forwardRef<HTMLElement, TreeViewLinkItemProps>(({href, onSelect, ...props}, ref) => {
  return (
    <Item
      ref={ref}
      onSelect={event => {
        window.open(href, '_self')
        onSelect?.(event)
      }}
      {...props}
    />
  )
})

LinkItem.displayName = 'TreeView.LinkItem'

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
}

const SubTree: React.FC<TreeViewSubTreeProps> = ({count, state, children}) => {
  const {announceUpdate} = React.useContext(RootContext)
  const {itemId, isExpanded, isSubTreeEmpty, setIsSubTreeEmpty} = React.useContext(ItemContext)
  const [isLoadingItemVisible, setIsLoadingItemVisible] = React.useState(false)
  const {safeSetTimeout} = useSafeTimeout()
  const loadingItemRef = React.useRef<HTMLElement>(null)
  const ref = React.useRef<HTMLElement>(null)

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

  // Announce when content has loaded
  React.useEffect(() => {
    if (state === 'done') {
      const parentItem = document.getElementById(itemId)

      if (!parentItem) return

      const {current: node} = ref
      const parentName = getAccessibleName(parentItem)

      safeSetTimeout(() => {
        if (node && node.childElementCount > 0) {
          announceUpdate(`${parentName} content loaded`)
        } else {
          announceUpdate(`${parentName} is empty`)
        }
      })
    }
  }, [state, itemId, announceUpdate, safeSetTimeout])

  // Manage loading indicator state
  React.useEffect(() => {
    // If we're in the loading state, but not showing the loading indicator yet,
    // show the loading indicator
    if (state === 'loading' && !isLoadingItemVisible) {
      setIsLoadingItemVisible(true)
    }

    // If we're not in the loading state, but we're still showing a loading indicator,
    // hide the loading indicator and move focus if necessary
    if (state !== 'loading' && isLoadingItemVisible) {
      const isLoadingItemFocused = document.activeElement === loadingItemRef.current

      setIsLoadingItemVisible(false)

      if (isLoadingItemFocused) {
        safeSetTimeout(() => {
          const parentElement = document.getElementById(itemId)
          if (!parentElement) return

          const firstChild = getFirstChildElement(parentElement)

          if (firstChild) {
            firstChild.focus()
          } else {
            parentElement.focus()
          }
        })
      }
    }
  }, [state, safeSetTimeout, isLoadingItemVisible, itemId])

  if (!isExpanded) {
    return null
  }

  return (
    <ul
      role="group"
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0
      }}
      // @ts-ignore Box doesn't have type support for `ref` used in combination with `as`
      ref={ref}
    >
      {isLoadingItemVisible ? <LoadingItem ref={loadingItemRef} count={count} /> : children}
    </ul>
  )
}

SubTree.displayName = 'TreeView.SubTree'

const shimmer = keyframes`
  from { mask-position: 200%; }
  to { mask-position: 0%; }
`

const SkeletonItem = styled.span.attrs({className: 'PRIVATE_TreeView-item-skeleton'})`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  height: 2rem;

  @media (pointer: coarse) {
    height: 2.75rem;
  }

  @media (prefers-reduced-motion: no-preference) {
    mask-image: linear-gradient(75deg, #000 30%, rgba(0, 0, 0, 0.65) 80%);
    mask-size: 200%;
    animation: ${shimmer};
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }

  &::before {
    content: '';
    display: block;
    width: 1rem;
    height: 1rem;
    background-color: ${get('colors.neutral.subtle')};
    border-radius: 3px;
    @media (forced-colors: active) {
      outline: 1px solid transparent;
      outline-offset: -1px;
    }
  }

  &::after {
    content: '';
    display: block;
    width: var(--tree-item-loading-width, 67%);
    height: 1rem;
    background-color: ${get('colors.neutral.subtle')};
    border-radius: 3px;
    @media (forced-colors: active) {
      outline: 1px solid transparent;
      outline-offset: -1px;
    }
  }

  &:nth-of-type(5n + 1) {
    --tree-item-loading-width: 67%;
  }

  &:nth-of-type(5n + 2) {
    --tree-item-loading-width: 47%;
  }

  &:nth-of-type(5n + 3) {
    --tree-item-loading-width: 73%;
  }

  &:nth-of-type(5n + 4) {
    --tree-item-loading-width: 64%;
  }

  &:nth-of-type(5n + 5) {
    --tree-item-loading-width: 50%;
  }
`

type LoadingItemProps = {
  count?: number
}

const LoadingItem = React.forwardRef<HTMLElement, LoadingItemProps>(({count}, ref) => {
  const itemId = useSSRSafeId()

  if (count) {
    return (
      <Item id={itemId} ref={ref}>
        {Array.from({length: count}).map((_, i) => {
          return <SkeletonItem aria-hidden={true} key={i} />
        })}
        <div className="PRIVATE_VisuallyHidden">Loading {count} items</div>
      </Item>
    )
  }

  return (
    <Item id={itemId} ref={ref}>
      <LeadingVisual>
        <Spinner size="small" />
      </LeadingVisual>
      <Text sx={{color: 'fg.muted'}}>Loading...</Text>
    </Item>
  )
})

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
    <Slot name="LeadingVisual">
      <div className="PRIVATE_VisuallyHidden" aria-hidden={true} id={leadingVisualId}>
        {props.label}
      </div>
      <div className="PRIVATE_TreeView-item-visual" aria-hidden={true}>
        {children}
      </div>
    </Slot>
  )
}

LeadingVisual.displayName = 'TreeView.LeadingVisual'

const TrailingVisual: React.FC<TreeViewVisualProps> = props => {
  const {isExpanded, trailingVisualId} = React.useContext(ItemContext)
  const children = typeof props.children === 'function' ? props.children({isExpanded}) : props.children
  return (
    <Slot name="TrailingVisual">
      <div className="PRIVATE_VisuallyHidden" aria-hidden={true} id={trailingVisualId}>
        {props.label}
      </div>
      <div className="PRIVATE_TreeView-item-visual" aria-hidden={true}>
        {children}
      </div>
    </Slot>
  )
}

TrailingVisual.displayName = 'TreeView.TrailingVisual'

// ----------------------------------------------------------------------------
// TreeView.DirectoryIcon

const DirectoryIcon = () => {
  const {isExpanded} = React.useContext(ItemContext)
  const Icon = isExpanded ? FileDirectoryOpenFillIcon : FileDirectoryFillIcon
  return (
    <div className="PRIVATE_TreeView-directory-icon">
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
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
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
  LinkItem,
  SubTree,
  LeadingVisual,
  TrailingVisual,
  DirectoryIcon,
  ErrorDialog
})
