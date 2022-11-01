import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileDirectoryFillIcon,
  FileDirectoryOpenFillIcon
} from '@primer/octicons-react'
import {useSSRSafeId} from '@react-aria/ssr'
import React from 'react'
import styled, {keyframes} from 'styled-components'
import Box from '../Box'
import {ConfirmationDialog} from '../Dialog/ConfirmationDialog'
import {get} from '../constants'
import {useControllableState} from '../hooks/useControllableState'
import useSafeTimeout from '../hooks/useSafeTimeout'
import Spinner from '../Spinner'
import StyledOcticon from '../StyledOcticon'
import sx, {SxProp, merge} from '../sx'
import Text from '../Text'
import {Theme} from '../ThemeProvider'
import createSlots from '../utils/create-slots'
import VisuallyHidden from '../_VisuallyHidden'
import {getAccessibleName} from './shared'
import {getFirstChildElement, useRovingTabIndex} from './useRovingTabIndex'
import {useTypeahead} from './useTypeahead'

// ----------------------------------------------------------------------------
// Context

const RootContext = React.createContext<{
  announceUpdate: (message: string) => void
}>({
  announceUpdate: () => {}
})

const ItemContext = React.createContext<{
  itemId: string
  level: number
  isSubTreeEmpty: boolean
  setIsSubTreeEmpty: React.Dispatch<React.SetStateAction<boolean>>
  isExpanded: boolean
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
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

const UlBox = styled.ul<SxProp>(sx)

const Root: React.FC<TreeViewProps> = ({'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, children}) => {
  const containerRef = React.useRef<HTMLUListElement>(null)
  const [ariaLiveMessage, setAriaLiveMessage] = React.useState('')

  useRovingTabIndex({containerRef})

  useTypeahead({
    containerRef,
    onFocusChange: element => {
      if (element instanceof HTMLElement) {
        element.focus()
      }
    }
  })

  const announceUpdate = React.useCallback((message: string) => {
    setAriaLiveMessage(message)
  }, [])

  return (
    <RootContext.Provider value={{announceUpdate}}>
      <>
        <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
          {ariaLiveMessage}
        </VisuallyHidden>
        <UlBox
          ref={containerRef}
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
        </UlBox>
      </>
    </RootContext.Provider>
  )
}

Root.displayName = 'TreeView'

// ----------------------------------------------------------------------------
// TreeView.Item

export type TreeViewItemProps = {
  children: React.ReactNode
  current?: boolean
  defaultExpanded?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
} & SxProp

const {Slots, Slot} = createSlots(['LeadingVisual', 'TrailingVisual'])

const Item = React.forwardRef<HTMLElement, TreeViewItemProps>(
  (
    {current: isCurrentItem = false, defaultExpanded = false, expanded, onExpandedChange, onSelect, children, sx = {}},
    ref
  ) => {
    const itemId = useSSRSafeId()
    const labelId = useSSRSafeId()
    const leadingVisualId = useSSRSafeId()
    const trailingVisualId = useSSRSafeId()
    const [isExpanded, setIsExpanded] = useControllableState({
      name: itemId,
      defaultValue: defaultExpanded,
      value: expanded,
      onChange: onExpandedChange
    })
    const {level} = React.useContext(ItemContext)
    const {hasSubTree, subTree, childrenWithoutSubTree} = useSubTree(children)
    const [isSubTreeEmpty, setIsSubTreeEmpty] = React.useState(!hasSubTree)

    // Expand or collapse the subtree
    const toggle = React.useCallback(
      (event?: React.MouseEvent | React.KeyboardEvent) => {
        setIsExpanded(!isExpanded)
        event?.stopPropagation()
      },
      // setIsExpanded is stable
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [isExpanded]
    )

    // If this item is the current item, expand it
    React.useLayoutEffect(
      () => {
        if (isCurrentItem) {
          setIsExpanded(true)
        }
      },
      // setIsExpanded is stable
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [isCurrentItem]
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
            setIsExpanded(true)
            break
          case 'ArrowLeft':
            event.preventDefault()
            event.stopPropagation()
            setIsExpanded(false)
            break
        }
      },
      [onSelect, setIsExpanded, toggle]
    )

    return (
      <ItemContext.Provider
        value={{
          itemId,
          level: level + 1,
          isSubTreeEmpty,
          setIsSubTreeEmpty,
          isExpanded,
          setIsExpanded,
          leadingVisualId,
          trailingVisualId
        }}
      >
        {/* @ts-ignore Box doesn't have type support for `ref` used in combination with `as` */}
        <Box
          as="li"
          ref={ref}
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
          }}
          sx={{
            outline: 'none',
            '&:focus-visible > div': {
              boxShadow: (theme: Theme) => `inset 0 0 0 2px ${theme.colors.accent.emphasis}`,
              '@media (forced-colors: active)': {
                outline: '2px solid HighlightText',
                outlineOffset: -2
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
            sx={merge.all([
              {
                '--toggle-width': '1rem', // 16px
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: `calc(${level - 1} * (var(--toggle-width) / 2)) var(--toggle-width) 1fr`,
                gridTemplateAreas: `"spacer toggle content"`,
                width: '100%',
                minHeight: '2rem', // 32px
                fontSize: 1,
                color: 'fg.default',
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'actionListItem.default.hoverBg',
                  '@media (forced-colors: active)': {
                    outline: '2px solid transparent',
                    outlineOffset: -2
                  }
                },
                '@media (pointer: coarse)': {
                  '--toggle-width': '1.5rem', // 24px
                  minHeight: '2.75rem' // 44px
                },
                '[role=treeitem][aria-current=true] > &:is(div)': {
                  bg: 'actionListItem.default.selectedBg',
                  '&::after': {
                    position: 'absolute',
                    top: 'calc(50% - 12px)',
                    left: -2,
                    width: '4px',
                    height: '24px',
                    content: '""',
                    bg: 'accent.fg',
                    borderRadius: 2,
                    '@media (forced-colors: active)': {
                      backgroundColor: 'HighlightText'
                    }
                  }
                }
              },
              sx as SxProp
            ])}
          >
            <Box sx={{gridArea: 'spacer', display: 'flex'}}>
              <LevelIndicatorLines level={level} />
            </Box>
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
                    backgroundColor: onSelect ? 'treeViewItem.chevron.hoverBg' : null
                  }
                }}
              >
                {isExpanded ? <ChevronDownIcon size={12} /> : <ChevronRightIcon size={12} />}
              </Box>
            ) : null}
            <Box
              id={labelId}
              sx={{
                gridArea: 'content',
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                px: 2,
                gap: 2
              }}
            >
              <Slots>
                {slots => (
                  <>
                    {slots.LeadingVisual}
                    <Text
                      sx={{
                        // Truncate text label
                        flex: '1 1 auto',
                        width: 0,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {childrenWithoutSubTree}
                    </Text>
                    {slots.TrailingVisual}
                  </>
                )}
              </Slots>
            </Box>
          </Box>
          {subTree}
        </Box>
      </ItemContext.Provider>
    )
  }
)

/** Lines to indicate the depth of an item in a TreeView */
const LevelIndicatorLines: React.FC<{level: number}> = ({level}) => {
  return (
    <Box sx={{width: '100%', display: 'flex'}}>
      {Array.from({length: level - 1}).map((_, index) => (
        <Box
          key={index}
          sx={{
            width: '100%',
            height: '100%',
            borderRight: '1px solid',

            // On devices without hover, the nesting indicator lines
            // appear at all times.
            borderColor: 'border.subtle',

            // On devices with :hover support, the nesting indicator lines
            // fade in when the user mouses over the entire component,
            // or when there's focus inside the component. This makes
            // sure the component remains simple when not in use.
            '@media (hover: hover)': {
              borderColor: 'transparent',
              '[role=tree]:hover &, [role=tree]:focus-within &': {
                borderColor: 'border.subtle'
              }
            }
          }}
        />
      ))}
    </Box>
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
  const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()
  const timeoutId = React.useRef<number>(0)
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

  // Show loading indicator after a short delay
  React.useEffect(() => {
    // If we're in the loading state, but not showing the loading indicator yet,
    // start a timer to show the loading indicator after a short delay.
    if (state === 'loading' && !isLoadingItemVisible) {
      timeoutId.current = safeSetTimeout(() => {
        setIsLoadingItemVisible(true)
      }, 300)
    }

    // If we're not in the loading state, but we're still showing a loading indicator,
    // hide the loading indicator and move focus if necessary
    if (state !== 'loading' && isLoadingItemVisible) {
      const isLoadingItemFocused = document.activeElement === loadingItemRef.current

      safeClearTimeout(timeoutId.current)
      setIsLoadingItemVisible(false)

      if (isLoadingItemFocused) {
        setTimeout(() => {
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
  }, [state, safeSetTimeout, safeClearTimeout, isLoadingItemVisible, itemId])

  if (!isExpanded) {
    return null
  }

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
      // @ts-ignore Box doesn't have type support for `ref` used in combination with `as`
      ref={ref}
    >
      {isLoadingItemVisible ? <LoadingItem ref={loadingItemRef} count={count} /> : children}
    </Box>
  )
}

SubTree.displayName = 'TreeView.SubTree'

const shimmer = keyframes`
  from { mask-position: 200%; }
  to { mask-position: 0%; }
`

const SkeletonItem = styled.span`
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

const LoadingItem = React.forwardRef<HTMLElement, LoadingItemProps>((props, ref) => {
  const {count} = props

  if (count) {
    return (
      <Item
        ref={ref}
        sx={{
          '&:hover': {
            backgroundColor: 'transparent',
            cursor: 'default',
            '@media (forced-colors: active)': {
              outline: 'none'
            }
          }
        }}
      >
        {Array.from({length: count}).map((_, i) => {
          return <SkeletonItem aria-hidden={true} key={i} />
        })}
        <VisuallyHidden>Loading {count} items</VisuallyHidden>
      </Item>
    )
  }

  return (
    <Item ref={ref}>
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
      <VisuallyHidden aria-hidden={true} id={leadingVisualId}>
        {props.label}
      </VisuallyHidden>
      <Box aria-hidden={true} sx={{display: 'flex', color: 'fg.muted'}}>
        {children}
      </Box>
    </Slot>
  )
}

LeadingVisual.displayName = 'TreeView.LeadingVisual'

const TrailingVisual: React.FC<TreeViewVisualProps> = props => {
  const {isExpanded, trailingVisualId} = React.useContext(ItemContext)
  const children = typeof props.children === 'function' ? props.children({isExpanded}) : props.children
  return (
    <Slot name="TrailingVisual">
      <VisuallyHidden aria-hidden={true} id={trailingVisualId}>
        {props.label}
      </VisuallyHidden>
      <Box aria-hidden={true} sx={{display: 'flex', color: 'fg.muted'}}>
        {children}
      </Box>
    </Slot>
  )
}

TrailingVisual.displayName = 'TreeView.TrailingVisual'

// ----------------------------------------------------------------------------
// TreeView.DirectoryIcon

const DirectoryIcon = () => {
  const {isExpanded} = React.useContext(ItemContext)
  const icon = isExpanded ? FileDirectoryOpenFillIcon : FileDirectoryFillIcon
  return <StyledOcticon icon={icon} color="treeViewItem.directory.fill" />
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
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
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
