import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileDirectoryFillIcon,
  FileDirectoryOpenFillIcon
} from '@primer/octicons-react'
import {useSSRSafeId} from '@react-aria/ssr'
import React from 'react'
import styled from 'styled-components'
import Box from '../Box'
import {useControllableState} from '../hooks/useControllableState'
import useSafeTimeout from '../hooks/useSafeTimeout'
import Spinner from '../Spinner'
import StyledOcticon from '../StyledOcticon'
import sx, {SxProp} from '../sx'
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
  isExpanded: boolean
  expandParents: () => void
  leadingVisualId: string
  trailingVisualId: string
}>({
  itemId: '',
  level: 1,
  isExpanded: false,
  expandParents: () => {},
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
        <VisuallyHidden role="status" aria-live="polite">
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
}

const {Slots, Slot} = createSlots(['LeadingVisual', 'TrailingVisual'])

const Item = React.forwardRef<HTMLElement, TreeViewItemProps>(
  ({current: isCurrentItem = false, defaultExpanded = false, expanded, onExpandedChange, onSelect, children}, ref) => {
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
    const {level, expandParents} = React.useContext(ItemContext)
    const {hasSubTree, subTree, childrenWithoutSubTree} = useSubTree(children)

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

    // Expand all parents of this item including itself
    const expandParentsAndSelf = React.useCallback(
      () => {
        expandParents()
        setIsExpanded(true)
      },
      // setIsExpanded is stable
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [expandParents]
    )

    // If this item is the current item, expand it and all its parents
    React.useLayoutEffect(() => {
      if (isCurrentItem) {
        expandParentsAndSelf()
      }
    }, [isCurrentItem, expandParentsAndSelf])

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
          isExpanded,
          expandParents: expandParentsAndSelf,
          leadingVisualId,
          trailingVisualId
        }}
      >
        <li
          ref={ref as React.RefObject<HTMLLIElement>}
          tabIndex={0}
          id={itemId}
          role="treeitem"
          aria-labelledby={labelId}
          aria-describedby={`${leadingVisualId} ${trailingVisualId}`}
          aria-level={level}
          aria-expanded={hasSubTree ? isExpanded : undefined}
          aria-current={isCurrentItem ? 'true' : undefined}
          style={{outline: 'none'}}
          onKeyDown={handleKeyDown}
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
              '--toggle-width': '1rem', // 16px
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: `calc(${level - 1} * (var(--toggle-width) / 2)) var(--toggle-width) 1fr`,
              gridTemplateAreas: `"spacer toggle content"`,
              width: '100%',
              height: '2rem', // 32px
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
                height: '2.75rem' // 44px
              },
              // WARNING: styled-components v5.2 introduced a bug that changed
              // how it expands `&` in CSS selectors. The following selectors
              // are unnecessarily specific to work around that styled-components bug.
              // Reference issue: https://github.com/styled-components/styled-components/issues/3265
              [`#${itemId}:focus-visible  > &:is(div)`]: {
                boxShadow: (theme: Theme) => `inset 0 0 0 2px ${theme.colors.accent.emphasis}`,
                '@media (forced-colors: active)': {
                  outline: '2px solid SelectedItem',
                  outlineOffset: -2
                }
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
                  borderRadius: 2
                }
              }
            }}
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
                {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
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
        </li>
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
}

const SubTree: React.FC<TreeViewSubTreeProps> = ({state, children}) => {
  const {announceUpdate} = React.useContext(RootContext)
  const {itemId, isExpanded} = React.useContext(ItemContext)
  const [isLoadingItemVisible, setIsLoadingItemVisible] = React.useState(false)
  const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()
  const timeoutId = React.useRef<number>(0)
  const loadingItemRef = React.useRef<HTMLElement>(null)

  // Announce when content has loaded
  React.useEffect(() => {
    if (state === 'done') {
      const parentItem = document.getElementById(itemId)

      if (!parentItem) return

      const parentName = getAccessibleName(parentItem)
      announceUpdate(`${parentName} content loaded`)
    }
  }, [state, itemId, announceUpdate])

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
      {isLoadingItemVisible ? <LoadingItem ref={loadingItemRef} /> : children}
    </Box>
  )
}

SubTree.displayName = 'TreeView.SubTree'

const LoadingItem = React.forwardRef<HTMLElement>((props, ref) => {
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
// Export

export const TreeView = Object.assign(Root, {
  Item,
  LinkItem,
  SubTree,
  LeadingVisual,
  TrailingVisual,
  DirectoryIcon
})
