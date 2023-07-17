import React, {useRef, forwardRef, useCallback, useState, MutableRefObject, RefObject, useEffect} from 'react'
import Box from '../Box'
import sx, {merge, BetterSystemStyleObject, SxProp} from '../sx'
import {UnderlineNavContext} from './UnderlineNavContext'
import {useResizeObserver, ResizeObserverEntry} from '../hooks/useResizeObserver'
import {useTheme} from '../ThemeProvider'
import {ChildWidthArray, ResponsiveProps, ChildSize} from './types'
import VisuallyHidden from '../_VisuallyHidden'
import {moreBtnStyles, getDividerStyle, getNavStyles, ulStyles, menuStyles, menuItemStyles, GAP} from './styles'
import styled from 'styled-components'
import {Button} from '../Button'
import {TriangleDownIcon} from '@primer/octicons-react'
import {useOnEscapePress} from '../hooks/useOnEscapePress'
import {useOnOutsideClick} from '../hooks/useOnOutsideClick'
import {useId} from '../hooks/useId'
import {ActionList} from '../ActionList'
import {defaultSxProp} from '../utils/defaultSxProp'
import CounterLabel from '../CounterLabel'
import {LoadingCounter} from './LoadingCounter'

export type UnderlineNavProps = {
  children: React.ReactNode
  'aria-label'?: React.AriaAttributes['aria-label']
  as?: React.ElementType
  sx?: SxProp['sx']
  /**
   * loading state for all counters. It displays loading animation for individual counters (UnderlineNav.Item) until all are resolved. It is needed to prevent multiple layout shift.
   */
  loadingCounters?: boolean
}
// When page is loaded, we don't have ref for the more button as it is not on the DOM yet.
// However, we need to calculate number of possible items when the more button present as well. So using the width of the more button as a constant.
const MORE_BTN_WIDTH = 86
// The height is needed to make sure we don't have a layout shift when the more button is the only item in the nav.
const MORE_BTN_HEIGHT = 45

// Needed this because passing a ref using HTMLULListElement to `Box` causes a type error
const NavigationList = styled.ul`
  ${sx};
`

const MoreMenuListItem = styled.li`
  display: flex;
  align-items: center;
  height: ${MORE_BTN_HEIGHT}px;
`

const overflowEffect = (
  navWidth: number,
  moreMenuWidth: number,
  childArray: Array<React.ReactElement>,
  childWidthArray: ChildWidthArray,
  noIconChildWidthArray: ChildWidthArray,
  updateListAndMenu: (props: ResponsiveProps, iconsVisible: boolean) => void,
) => {
  let iconsVisible = true
  if (childWidthArray.length === 0) {
    updateListAndMenu({items: childArray, actions: []}, iconsVisible)
  }
  const numberOfItemsPossible = calculatePossibleItems(childWidthArray, navWidth)
  const numberOfItemsWithoutIconPossible = calculatePossibleItems(noIconChildWidthArray, navWidth)
  // We need to take more menu width into account when calculating the number of items possible
  const numberOfItemsPossibleWithMoreMenu = calculatePossibleItems(
    noIconChildWidthArray,
    navWidth,
    moreMenuWidth || MORE_BTN_WIDTH,
  )
  const items: Array<React.ReactElement> = []
  const actions: Array<React.ReactElement> = []

  // console.log({childArray})

  // First, we check if we can fit all the items with their icons
  if (childArray.length <= numberOfItemsPossible) {
    items.push(...childArray)
  } else if (childArray.length <= numberOfItemsWithoutIconPossible) {
    // if we can't fit all the items with their icons, we check if we can fit all the items without their icons
    iconsVisible = false
    items.push(...childArray)
  } else {
    // if we can't fit all the items without their icons, we keep the icons hidden and show the ones that doesn't fit into the list in the overflow menu
    iconsVisible = false

    /* Below is an accessibiility requirement. Never show only one item in the overflow menu.
     * If there is only one item left to display in the overflow menu according to the calculation,
     * we need to pull another item from the list into the overflow menu.
     */
    const numberOfItemsInMenu = childArray.length - numberOfItemsPossibleWithMoreMenu
    const numberOfListItems =
      numberOfItemsInMenu === 1 ? numberOfItemsPossibleWithMoreMenu - 1 : numberOfItemsPossibleWithMoreMenu
    for (const [index, child] of childArray.entries()) {
      if (index < numberOfListItems) {
        console.log('hi child', child)
        items.push(child)
      } else {
        console.log('hi child', child)
        const ariaCurrent = child.props['aria-current']
        const isCurrent = Boolean(ariaCurrent) && ariaCurrent !== 'false'
        // We need to make sure to keep the selected item always visible.
        // To do that, we swap the selected item with the last item in the list to make it visible. (When there is at least 1 item in the list to swap.)
        if (isCurrent && numberOfListItems > 0) {
          // If selected item couldn't make in to the list, we swap it with the last item in the list.
          const indexToReplaceAt = numberOfListItems - 1 // because we are replacing the last item in the list
          // splice method modifies the array by removing 1 item here at the given index and replace it with the "child" element then returns the removed item.
          const propsectiveAction = items.splice(indexToReplaceAt, 1, child)[0]
          actions.push(propsectiveAction)
        } else {
          actions.push(child)
        }
      }
    }
  }
  updateListAndMenu({items, actions}, iconsVisible)
}

const getValidChildren = (children: React.ReactNode) => {
  console.log('children', children)
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement[]
}

const calculatePossibleItems = (childWidthArray: ChildWidthArray, navWidth: number, moreMenuWidth = 0) => {
  const widthToFit = navWidth - moreMenuWidth
  let breakpoint = childWidthArray.length // assume all items will fit
  let sumsOfChildWidth = 0
  for (const [index, childWidth] of childWidthArray.entries()) {
    sumsOfChildWidth = sumsOfChildWidth + childWidth.width + GAP
    if (sumsOfChildWidth > widthToFit) {
      breakpoint = index
      break
    } else {
      continue
    }
  }
  return breakpoint
}

export const UnderlineNav = forwardRef(
  (
    {
      as = 'nav',
      'aria-label': ariaLabel,
      sx: sxProp = defaultSxProp,
      loadingCounters = false,
      children,
    }: UnderlineNavProps,
    forwardedRef,
  ) => {
    const backupRef = useRef<HTMLElement>(null)
    const navRef = (forwardedRef ?? backupRef) as MutableRefObject<HTMLElement>
    const listRef = useRef<HTMLUListElement>(null)
    const moreMenuRef = useRef<HTMLLIElement>(null)
    const moreMenuBtnRef = useRef<HTMLButtonElement>(null)
    const containerRef = React.useRef<HTMLUListElement>(null)
    const itemRef = useRef<HTMLAnchorElement>(null)
    const disclosureWidgetId = useId()

    const {theme} = useTheme()

    function getItemsWidth(itemText: string): number {
      return noIconChildWidthArray.find(item => item.text === itemText)?.width || 0
    }

    const swapMenuItemWithListItem = (
      prospectiveListItem: React.ReactElement,
      indexOfProspectiveListItem: number,
      event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
      callback: (props: ResponsiveProps, displayIcons: boolean) => void,
    ) => {
      // get the selected menu item's width
      const widthToFitIntoList = getItemsWidth(prospectiveListItem.props.children)
      // Check if there is any empty space on the right side of the list
      const availableSpace =
        navRef.current.getBoundingClientRect().width - (listRef.current?.getBoundingClientRect().width || 0)

      // Calculate how many items need to be pulled in to the menu to make room for the selected menu item
      // I.e. if we need to pull 2 items in (index 0 and index 1), breakpoint (index) will return 1.
      const index = getBreakpointForItemSwapping(widthToFitIntoList, availableSpace)
      const indexToSliceAt = responsiveProps.items.length - 1 - index
      // Form the new list of items
      const itemsLeftInList = [...responsiveProps.items].slice(0, indexToSliceAt)
      const updatedItemList = [...itemsLeftInList, prospectiveListItem]
      // Form the new menu items
      const itemsToAddToMenu = [...responsiveProps.items].slice(indexToSliceAt)
      const updatedMenuItems = [...actions]
      // Add itemsToAddToMenu array's items to the menu at the index of the prospectiveListItem and remove 1 count of items (prospectiveListItem)
      updatedMenuItems.splice(indexOfProspectiveListItem, 1, ...itemsToAddToMenu)
      callback({items: updatedItemList, actions: updatedMenuItems}, false)
    }
    // How many items do we need to pull in to the menu to make room for the selected menu item.
    function getBreakpointForItemSwapping(widthToFitIntoList: number, availableSpace: number) {
      let widthToSwap = 0
      let breakpoint = 0
      for (const [index, item] of [...responsiveProps.items].reverse().entries()) {
        widthToSwap += getItemsWidth(item.props.children)
        if (widthToFitIntoList < widthToSwap + availableSpace) {
          breakpoint = index
          break
        }
      }
      return breakpoint
    }

    const [iconsVisible, setIconsVisible] = useState<boolean>(true)

    const [responsiveProps, setResponsiveProps] = useState<ResponsiveProps>({
      items: getValidChildren(children),
      actions: [],
    })

    const [currentItem, setCurrentItem] = useState<RefObject<HTMLElement> | undefined>(undefined)

    const [actionSwapKey, setActionSwapKey] = useState<string | undefined>(undefined)

    /*
     * This is needed to make sure responsiveProps.items and ResponsiveProps.actions are updated when children are changed
     * Particually when an item is selected. It adds 'aria-current="page"' attribute to the child and we need to make sure
     * responsiveProps.items and ResponsiveProps.actions are updated with that attribute
     */
    useEffect(() => {
      const childArray = getValidChildren(children)

      const updatedItems = responsiveProps.items.map(item => {
        return childArray.find(child => child.key === item.key) || item
      })

      const updatedActions = responsiveProps.actions.map(action => {
        return childArray.find(child => child.key === action.key) || action
      })

      setResponsiveProps({
        items: updatedItems,
        actions: updatedActions,
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children])

    const updateListAndMenu = useCallback((props: ResponsiveProps, displayIcons: boolean) => {
      setResponsiveProps(props)
      setIconsVisible(displayIcons)
    }, [])

    const actions = responsiveProps.actions
    // This is the case where the viewport is too narrow to show any list item with the more menu. In this case, we only show the dropdown
    const onlyMenuVisible = responsiveProps.items.length === 0
    const [childWidthArray, setChildWidthArray] = useState<ChildWidthArray>([])
    const setChildrenWidth = useCallback((size: ChildSize) => {
      setChildWidthArray(arr => {
        const newArr = [...arr, size]
        return newArr
      })
    }, [])

    const [noIconChildWidthArray, setNoIconChildWidthArray] = useState<ChildWidthArray>([])
    const setNoIconChildrenWidth = useCallback((size: ChildSize) => {
      setNoIconChildWidthArray(arr => {
        const newArr = [...arr, size]
        return newArr
      })
    }, [])

    useResizeObserver((resizeObserverEntries: ResizeObserverEntry[]) => {
      const childArray = getValidChildren(children)
      const navWidth = resizeObserverEntries[0].contentRect.width
      const moreMenuWidth = moreMenuRef.current?.getBoundingClientRect().width ?? 0
      navWidth !== 0 &&
        overflowEffect(navWidth, moreMenuWidth, childArray, childWidthArray, noIconChildWidthArray, updateListAndMenu)
    }, navRef as RefObject<HTMLElement>)

    if (!ariaLabel) {
      // eslint-disable-next-line no-console
      console.warn('Use the `aria-label` prop to provide an accessible label for assistive technology')
    }
    const [isWidgetOpen, setIsWidgetOpen] = useState(false)

    const closeOverlay = React.useCallback(() => {
      setIsWidgetOpen(false)
    }, [setIsWidgetOpen])

    const focusOnMoreMenuBtn = React.useCallback(() => {
      moreMenuBtnRef.current?.focus()
    }, [])

    useOnEscapePress(
      (event: KeyboardEvent) => {
        if (isWidgetOpen) {
          event.preventDefault()
          closeOverlay()
          focusOnMoreMenuBtn()
        }
      },
      [isWidgetOpen],
    )

    useOnOutsideClick({onClickOutside: closeOverlay, containerRef, ignoreClickRefs: [moreMenuBtnRef]})
    const onAnchorClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.defaultPrevented || event.button !== 0) {
        return
      }
      setIsWidgetOpen(isWidgetOpen => !isWidgetOpen)
    }, [])

    return (
      <UnderlineNavContext.Provider
        value={{
          theme,
          setChildrenWidth,
          setNoIconChildrenWidth,
          currentItem,
          setCurrentItem,
          loadingCounters,
          iconsVisible,
          actionSwapKey,
          setActionSwapKey,
        }}
      >
        {ariaLabel && <VisuallyHidden as="h2">{`${ariaLabel} navigation`}</VisuallyHidden>}
        <Box
          as={as}
          sx={merge<BetterSystemStyleObject>(getNavStyles(theme), sxProp)}
          aria-label={ariaLabel}
          ref={navRef}
        >
          <NavigationList sx={ulStyles} ref={listRef} role="list">
            {responsiveProps.items.map(listItem => {
              return (
                <Box
                  key={listItem.props.children}
                  as="li"
                  sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
                >
                  {listItem}
                </Box>
              )
            })}
            {actions.length > 0 && (
              <MoreMenuListItem ref={moreMenuRef}>
                {!onlyMenuVisible && <Box sx={getDividerStyle(theme)}></Box>}
                <Button
                  ref={moreMenuBtnRef}
                  sx={moreBtnStyles}
                  aria-controls={disclosureWidgetId}
                  aria-expanded={isWidgetOpen}
                  onClick={onAnchorClick}
                  trailingAction={TriangleDownIcon}
                >
                  <Box as="span">
                    {onlyMenuVisible ? (
                      <>
                        <VisuallyHidden as="span">{`${ariaLabel}`}&nbsp;</VisuallyHidden>Menu
                      </>
                    ) : (
                      <>
                        More<VisuallyHidden as="span">&nbsp;{`${ariaLabel} items`}</VisuallyHidden>
                      </>
                    )}
                  </Box>
                </Button>
                <ActionList
                  selectionVariant="single"
                  ref={containerRef}
                  id={disclosureWidgetId}
                  sx={menuStyles}
                  style={{display: isWidgetOpen ? 'block' : 'none'}}
                >
                  {actions.map((action, index) => {
                    const {
                      children: actionElementChildren,
                      counter,
                      // currentItem,
                      'aria-current': ariaCurrent,
                      defaultSelected,
                      onSelect,
                      ...actionElementProps
                    } = action.props

                    // This logic is used to pop the selected item out of the menu and into the list when the navigation is control externally
                    if (defaultSelected || (Boolean(ariaCurrent) && ariaCurrent !== 'false')) {
                      const event = new MouseEvent('click')
                      !onlyMenuVisible &&
                        swapMenuItemWithListItem(
                          action,
                          index,
                          // @ts-ignore - not a big deal because it is internally creating an event but ask help
                          event as React.MouseEvent<HTMLAnchorElement>,
                          updateListAndMenu,
                        )
                    }

                    return (
                      <ActionList.LinkItem
                        data-component="menu-item"
                        key={actionElementChildren}
                        sx={menuItemStyles}
                        // aria-current={currentItem === actionListLinkItemRef ? 'page' : undefined}
                        onClick={(
                          event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
                        ) => {
                          // When there are no items in the list, do not run the swap function as we want to keep everything in the menu.
                          !onlyMenuVisible && swapMenuItemWithListItem(action, index, event, updateListAndMenu)
                          // setCurrentItem(actionListLinkItemRef)
                          setActionSwapKey(actionElementChildren)

                          closeOverlay()
                          focusOnMoreMenuBtn()
                          // fire onSelect event that comes from the UnderlineNav.Item (if it is defined)
                          typeof onSelect === 'function' && onSelect(event)
                        }}
                        {...actionElementProps}
                      >
                        <Box as="span" sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                          {actionElementChildren}
                          {loadingCounters ? (
                            <LoadingCounter />
                          ) : (
                            counter !== undefined && (
                              <Box as="span" data-component="counter">
                                <CounterLabel>{counter}</CounterLabel>
                              </Box>
                            )
                          )}
                        </Box>
                      </ActionList.LinkItem>
                    )
                  })}
                </ActionList>
              </MoreMenuListItem>
            )}
          </NavigationList>
        </Box>
      </UnderlineNavContext.Provider>
    )
  },
)

UnderlineNav.displayName = 'UnderlineNav'
