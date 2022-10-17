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
import {getFirstChildElement, useActiveDescendant} from './useActiveDescendant'
import {useTypeahead} from './useTypeahead'

// ----------------------------------------------------------------------------
// Context

const RootContext = React.createContext<{
  announceUpdate: (message: string) => void
  activeDescendant: string
  setActiveDescendant: React.Dispatch<React.SetStateAction<string>>
}>({
  announceUpdate: () => {},
  activeDescendant: '',
  setActiveDescendant: () => {}
})

const ItemContext = React.createContext<{
  itemId: string
  level: number
  isExpanded: boolean
  expandParents: () => void
}>({
  itemId: '',
  level: 1,
  isExpanded: false,
  expandParents: () => {}
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

  const [activeDescendant, setActiveDescendant] = useActiveDescendant({containerRef})

  useTypeahead({
    containerRef,
    onFocusChange: element => setActiveDescendant(element.id)
  })

  const announceUpdate = React.useCallback((message: string) => {
    setAriaLiveMessage(message)
  }, [])

  return (
    <RootContext.Provider value={{announceUpdate, activeDescendant, setActiveDescendant}}>
      <>
        <VisuallyHidden role="status" aria-live="polite">
          {ariaLiveMessage}
        </VisuallyHidden>
        <UlBox
          ref={containerRef}
          tabIndex={0}
          role="tree"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-activedescendant={activeDescendant}
          sx={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            // We'll display a focus ring around the active descendant
            // instead of the tree itself
            outline: 0
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
  onSelect?: (event: React.MouseEvent<HTMLElement> | KeyboardEvent) => void
}

const {Slots, Slot} = createSlots(['LeadingVisual', 'TrailingVisual'])

const Item: React.FC<TreeViewItemProps> = ({
  current: isCurrentItem = false,
  defaultExpanded = false,
  expanded,
  onExpandedChange,
  onSelect,
  children
}) => {
  const {setActiveDescendant} = React.useContext(RootContext)
  const itemId = useSSRSafeId()
  const labelId = useSSRSafeId()
  const itemRef = React.useRef<HTMLLIElement>(null)
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
    (event?: React.MouseEvent) => {
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

  React.useEffect(() => {
    const element = itemRef.current

    function handleKeyDown(event: KeyboardEvent) {
      // WARNING: Removing this line will cause an infinite loop!
      // The root element receives all keyboard events and forwards them
      // to the active descendant. If we don't stop propagation here,
      // the event will bubble back up to the root element and be forwarded
      // back to the active descendant infinitely.
      event.stopPropagation()

      switch (event.key) {
        case 'Enter':
          if (onSelect) {
            onSelect(event)
          } else {
            toggle()
          }
          break

        case 'ArrowRight':
          event.preventDefault()
          setIsExpanded(true)
          break

        case 'ArrowLeft':
          event.preventDefault()
          setIsExpanded(false)
          break
      }
    }

    element?.addEventListener('keydown', handleKeyDown)
    return () => element?.removeEventListener('keydown', handleKeyDown)
  }, [toggle, onSelect, setIsExpanded])

  return (
    <ItemContext.Provider value={{itemId, level: level + 1, isExpanded, expandParents: expandParentsAndSelf}}>
      <li
        id={itemId}
        ref={itemRef}
        role="treeitem"
        aria-labelledby={labelId}
        aria-level={level}
        aria-expanded={hasSubTree ? isExpanded : undefined}
        aria-current={isCurrentItem ? 'true' : undefined}
      >
        <Box
          onClick={event => {
            setActiveDescendant(itemId)
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
            [`[role=tree][aria-activedescendant="${itemId}"]:focus-visible #${itemId} > &:is(div)`]: {
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
                  setActiveDescendant(itemId)
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
              '[role=tree]:hover &, [role=tree]:focus &': {
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
const LinkItem: React.FC<TreeViewLinkItemProps> = ({href, onSelect, ...props}) => {
  return (
    <Item
      onSelect={event => {
        window.open(href, '_self')
        onSelect?.(event)
      }}
      {...props}
    />
  )
}

LinkItem.displayName = 'TreeView.LinkItem'

// ----------------------------------------------------------------------------
// TreeView.SubTree

export type SubTreeState = 'initial' | 'loading' | 'done' | 'error'

export type TreeViewSubTreeProps = {
  children?: React.ReactNode
  state?: SubTreeState
}

const SubTree: React.FC<TreeViewSubTreeProps> = ({state, children}) => {
  const {activeDescendant, setActiveDescendant, announceUpdate} = React.useContext(RootContext)
  const {itemId, isExpanded} = React.useContext(ItemContext)
  const [isLoadingItemVisible, setIsLoadingItemVisible] = React.useState(false)
  const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()
  const timeoutId = React.useRef<number>(0)
  const activeDescendantRef = React.useRef(activeDescendant)

  React.useEffect(() => {
    activeDescendantRef.current = activeDescendant
  }, [activeDescendant])

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
    if (state === 'loading' && !isLoadingItemVisible) {
      timeoutId.current = safeSetTimeout(() => {
        setIsLoadingItemVisible(true)
      }, 300)
    }

    if (state !== 'loading' && isLoadingItemVisible) {
      safeClearTimeout(timeoutId.current)
      setIsLoadingItemVisible(false)

      // If the active descendant was removed from the DOM after hiding the
      // LoadingItem, we know the LoadingItem was the active descendant
      // and we need to update the active descendant to the first loaded item
      // or the parent item (if the subtree is empty).
      setTimeout(() => {
        const activeElement = document.getElementById(activeDescendantRef.current)

        if (!activeElement) {
          const parentElement = document.getElementById(itemId)
          if (!parentElement) return

          const firstChild = getFirstChildElement(parentElement)
          setActiveDescendant(firstChild ? firstChild.id : parentElement.id)
        }
      })
    }
  }, [state, safeSetTimeout, safeClearTimeout, setActiveDescendant, isLoadingItemVisible, itemId])

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
      {isLoadingItemVisible ? <LoadingItem /> : children}
    </Box>
  )
}

SubTree.displayName = 'TreeView.SubTree'

const LoadingItem = () => {
  return (
    <Item>
      <LeadingVisual>
        <Spinner size="small" />
      </LeadingVisual>
      <Text sx={{color: 'fg.muted'}}>Loading...</Text>
    </Item>
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
// TreeView.LeadingVisual and TreeView.TrailingVisual

export type TreeViewVisualProps = {
  children: React.ReactNode | ((props: {isExpanded: boolean}) => React.ReactNode)
}

const LeadingVisual: React.FC<TreeViewVisualProps> = props => {
  const {isExpanded} = React.useContext(ItemContext)
  const children = typeof props.children === 'function' ? props.children({isExpanded}) : props.children
  return (
    <Slot name="LeadingVisual">
      <Box sx={{display: 'flex', color: 'fg.muted'}}>{children}</Box>
    </Slot>
  )
}

LeadingVisual.displayName = 'TreeView.LeadingVisual'

const TrailingVisual: React.FC<TreeViewVisualProps> = props => {
  const {isExpanded} = React.useContext(ItemContext)
  const children = typeof props.children === 'function' ? props.children({isExpanded}) : props.children
  return (
    <Slot name="TrailingVisual">
      <Box sx={{display: 'flex', color: 'fg.muted'}}>{children}</Box>
    </Slot>
  )
}

TrailingVisual.displayName = 'TreeView.TrailingVisual'

// ----------------------------------------------------------------------------
// TreeView.DirectoryIcon

const DirectoryIcon = () => {
  const {isExpanded} = React.useContext(ItemContext)
  const icon = isExpanded ? FileDirectoryOpenFillIcon : FileDirectoryFillIcon
  // TODO: Use correct color
  return <StyledOcticon icon={icon} />
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
