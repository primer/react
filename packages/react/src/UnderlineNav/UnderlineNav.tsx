import type {RefObject} from 'react'
import React, {useRef, forwardRef, useCallback, useState, useEffect} from 'react'
import {UnderlineNavContext} from './UnderlineNavContext'
import type {ResizeObserverEntry} from '../hooks/useResizeObserver'
import {useResizeObserver} from '../hooks/useResizeObserver'
import type {ChildWidthArray, ResponsiveProps, ChildSize, ResponsiveOverflowConfig} from './types'
import VisuallyHidden from '../_VisuallyHidden'
import {dividerStyles, menuItemStyles, baseMenuMinWidth} from './styles'
import {UnderlineItemList, UnderlineWrapper, LoadingCounter, GAP} from '../internal/components/UnderlineTabbedInterface'
import {Button} from '../Button'
import {TriangleDownIcon} from '@primer/octicons-react'
import {useOnEscapePress} from '../hooks/useOnEscapePress'
import {useOnOutsideClick} from '../hooks/useOnOutsideClick'
import {useId} from '../hooks/useId'
import {ActionList} from '../ActionList'
import CounterLabel from '../CounterLabel'
import {invariant} from '../utils/invariant'
import classes from './UnderlineNav.module.css'
import {getAnchoredPosition} from '@primer/behaviors'

export type UnderlineNavProps = {
  children: React.ReactNode
  'aria-label'?: React.AriaAttributes['aria-label']
  as?: React.ElementType
  className?: string
  /**
   * loading state for all counters. It displays loading animation for individual counters (UnderlineNav.Item) until all are resolved. It is needed to prevent multiple layout shift.
   */
  loadingCounters?: boolean
  /**
   * There are cases where you may not want the horizontal padding on items,
   * and panels to make the tabs look horizontally aligned with the content above and below it.
   * Setting this to `flush` will remove the horizontal padding on the items.
   */
  variant?: 'inset' | 'flush'
  /**
   * When provided, items are rendered with data attributes that CSS media queries use
   * to control visibility. The overflow menu is always rendered but uses CSS to hide
   * items that are visible inline at the current viewport.
   *
   * Example:
   * ```
   * {
   *   narrow: [0, 1],        // Show first 2 items inline at narrow viewport
   *   regular: [0, 1, 2, 3], // Show first 4 items inline at regular viewport
   *   wide: 'all'            // Show all items inline at wide viewport
   * }
   * ```
   */
  responsiveOverflow?: ResponsiveOverflowConfig
}
// When page is loaded, we don't have ref for the more button as it is not on the DOM yet.
// However, we need to calculate number of possible items when the more button present as well. So using the width of the more button as a constant.
export const MORE_BTN_WIDTH = 86
// The height is needed to make sure we don't have a layout shift when the more button is the only item in the nav.
const MORE_BTN_HEIGHT = 45

const overflowEffect = (
  navWidth: number,
  moreMenuWidth: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  childArray: Array<React.ReactElement<any>>,
  childWidthArray: ChildWidthArray,
  noIconChildWidthArray: ChildWidthArray,
  updateListAndMenu: (props: ResponsiveProps, iconsVisible: boolean) => void,
) => {
  let iconsVisible = false
  if (childWidthArray.length === 0) {
    updateListAndMenu({items: childArray, menuItems: []}, iconsVisible)
  }
  const numberOfItemsPossible = calculatePossibleItems(childWidthArray, navWidth)
  const numberOfItemsWithoutIconPossible = calculatePossibleItems(noIconChildWidthArray, navWidth)
  // We need to take more menu width into account when calculating the number of items possible
  const numberOfItemsPossibleWithMoreMenu = calculatePossibleItems(
    noIconChildWidthArray,
    navWidth,
    moreMenuWidth || MORE_BTN_WIDTH,
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: Array<React.ReactElement<any>> = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const menuItems: Array<React.ReactElement<any>> = []

  // First, we check if we can fit all the items with their icons
  if (childArray.length <= numberOfItemsPossible) {
    items.push(...childArray)
    iconsVisible = true
  } else if (childArray.length <= numberOfItemsWithoutIconPossible) {
    // if we can't fit all the items with their icons, we check if we can fit all the items without their icons
    iconsVisible = false
    items.push(...childArray)
  } else {
    // if we can't fit all the items without their icons, we keep the icons hidden and show the ones that doesn't fit into the list in the overflow menu
    iconsVisible = false

    /* Below is an accessibility requirement. Never show only one item in the overflow menu.
     * If there is only one item left to display in the overflow menu according to the calculation,
     * we need to pull another item from the list into the overflow menu.
     */
    const numberOfItemsInMenu = childArray.length - numberOfItemsPossibleWithMoreMenu
    const numberOfListItems =
      numberOfItemsInMenu === 1 ? numberOfItemsPossibleWithMoreMenu - 1 : numberOfItemsPossibleWithMoreMenu
    for (const [index, child] of childArray.entries()) {
      if (index < numberOfListItems) {
        items.push(child)
      } else {
        const ariaCurrent = child.props['aria-current']
        const isCurrent = Boolean(ariaCurrent) && ariaCurrent !== 'false'
        // We need to make sure to keep the selected item always visible.
        // To do that, we swap the selected item with the last item in the list to make it visible. (When there is at least 1 item in the list to swap.)
        if (isCurrent && numberOfListItems > 0) {
          // If selected item couldn't make in to the list, we swap it with the last item in the list.
          const indexToReplaceAt = numberOfListItems - 1 // because we are replacing the last item in the list
          // splice method modifies the array by removing 1 item here at the given index and replace it with the "child" element then returns the removed item.
          const propsectiveAction = items.splice(indexToReplaceAt, 1, child)[0]
          menuItems.push(propsectiveAction)
        } else {
          menuItems.push(child)
        }
      }
    }
  }
  updateListAndMenu({items, menuItems}, iconsVisible)
}

export const getValidChildren = (children: React.ReactNode) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement<any>[]
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

// Inline styles converted from baseMenuStyles for use as CSSProperties
const baseMenuInlineStyles: React.CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  top: '90%',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  borderRadius: 12,
  background: 'var(--overlay-bgColor)',
  listStyle: 'none',
  minWidth: `${baseMenuMinWidth}px`,
  maxWidth: '640px',
  right: 0,
}

/**
 * Check if an item index should be hidden at a given breakpoint
 */
function isItemHiddenAtBreakpoint(
  config: ResponsiveOverflowConfig,
  breakpoint: 'xnarrow' | 'narrow' | 'regular' | 'medium' | 'large' | 'wide',
  index: number,
): boolean {
  const visibleItems = config[breakpoint]
  if (visibleItems === undefined || visibleItems === 'all') {
    return false
  }
  return !visibleItems.includes(index)
}

/**
 * Get data attributes for an inline item based on responsive config
 */
function getResponsiveItemAttributes(
  config: ResponsiveOverflowConfig,
  index: number,
): {
  'data-hide-xnarrow'?: boolean
  'data-hide-narrow'?: boolean
  'data-hide-regular'?: boolean
  'data-hide-medium'?: boolean
  'data-hide-large'?: boolean
  'data-hide-wide'?: boolean
} {
  return {
    'data-hide-xnarrow': isItemHiddenAtBreakpoint(config, 'xnarrow', index) || undefined,
    'data-hide-narrow': isItemHiddenAtBreakpoint(config, 'narrow', index) || undefined,
    'data-hide-regular': isItemHiddenAtBreakpoint(config, 'regular', index) || undefined,
    'data-hide-medium': isItemHiddenAtBreakpoint(config, 'medium', index) || undefined,
    'data-hide-large': isItemHiddenAtBreakpoint(config, 'large', index) || undefined,
    'data-hide-wide': isItemHiddenAtBreakpoint(config, 'wide', index) || undefined,
  }
}

/**
 * Get data attributes for a menu item based on responsive config.
 * Menu items should be hidden when they are visible inline.
 */
function getResponsiveMenuItemAttributes(
  config: ResponsiveOverflowConfig,
  index: number,
): {
  'data-hide-in-menu-xnarrow'?: boolean
  'data-hide-in-menu-narrow'?: boolean
  'data-hide-in-menu-regular'?: boolean
  'data-hide-in-menu-medium'?: boolean
  'data-hide-in-menu-large'?: boolean
  'data-hide-in-menu-wide'?: boolean
} {
  // Hide in menu when NOT hidden inline (i.e., when visible inline)
  return {
    'data-hide-in-menu-xnarrow': !isItemHiddenAtBreakpoint(config, 'xnarrow', index) || undefined,
    'data-hide-in-menu-narrow': !isItemHiddenAtBreakpoint(config, 'narrow', index) || undefined,
    'data-hide-in-menu-regular': !isItemHiddenAtBreakpoint(config, 'regular', index) || undefined,
    'data-hide-in-menu-medium': !isItemHiddenAtBreakpoint(config, 'medium', index) || undefined,
    'data-hide-in-menu-large': !isItemHiddenAtBreakpoint(config, 'large', index) || undefined,
    'data-hide-in-menu-wide': !isItemHiddenAtBreakpoint(config, 'wide', index) || undefined,
  }
}

/**
 * Get data attributes for the menu container based on responsive config.
 * Menu should be hidden when all items are visible inline.
 */
function getResponsiveMenuContainerAttributes(config: ResponsiveOverflowConfig): {
  'data-hide-menu-xnarrow'?: boolean
  'data-hide-menu-narrow'?: boolean
  'data-hide-menu-regular'?: boolean
  'data-hide-menu-medium'?: boolean
  'data-hide-menu-large'?: boolean
  'data-hide-menu-wide'?: boolean
} {
  return {
    'data-hide-menu-xnarrow': config.xnarrow === 'all' || undefined,
    'data-hide-menu-narrow': config.narrow === 'all' || undefined,
    'data-hide-menu-regular': config.regular === 'all' || undefined,
    'data-hide-menu-medium': config.medium === 'all' || undefined,
    'data-hide-menu-large': config.large === 'all' || undefined,
    'data-hide-menu-wide': config.wide === 'all' || undefined,
  }
}

/**
 * Get all item indices that could be hidden at any breakpoint.
 * These items need to be included in the overflow menu.
 */
function getResponsiveMenuItemIndices(config: ResponsiveOverflowConfig, totalItems: number): number[] {
  const hiddenIndices = new Set<number>()

  for (const breakpoint of ['xnarrow', 'narrow', 'regular', 'medium', 'large', 'wide'] as const) {
    const visibleItems = config[breakpoint]
    if (visibleItems !== undefined && visibleItems !== 'all') {
      for (let i = 0; i < totalItems; i++) {
        if (!visibleItems.includes(i)) {
          hiddenIndices.add(i)
        }
      }
    }
  }

  return Array.from(hiddenIndices).sort((a, b) => a - b)
}

export const UnderlineNav = forwardRef(
  (
    {
      as = 'nav',
      'aria-label': ariaLabel,
      loadingCounters = false,
      variant = 'inset',
      className,
      children,
      responsiveOverflow,
    }: UnderlineNavProps,
    forwardedRef,
  ) => {
    const backupRef = useRef<HTMLElement>(null)
    const navRef = (forwardedRef ?? backupRef) as RefObject<HTMLElement>
    const listRef = useRef<HTMLUListElement>(null)
    const moreMenuRef = useRef<HTMLLIElement>(null)
    const moreMenuBtnRef = useRef<HTMLButtonElement>(null)
    const containerRef = React.useRef<HTMLUListElement>(null)
    const disclosureWidgetId = useId()

    // Determine if we're using CSS-based responsive mode
    const useResponsiveMode = Boolean(responsiveOverflow)

    const [isWidgetOpen, setIsWidgetOpen] = useState(false)
    const [iconsVisible, setIconsVisible] = useState<boolean>(false)
    const [childWidthArray, setChildWidthArray] = useState<ChildWidthArray>([])
    const [noIconChildWidthArray, setNoIconChildWidthArray] = useState<ChildWidthArray>([])
    // Track whether the initial overflow calculation is complete to prevent CLS
    // In responsive mode, we're ready immediately since CSS handles visibility
    const [isReady, setIsReady] = useState(useResponsiveMode)

    const validChildren = getValidChildren(children)

    // Responsive props object manages which items are in the list and which items are in the menu.
    const [responsiveProps, setResponsiveProps] = useState<ResponsiveProps>({
      items: validChildren,
      menuItems: [],
    })

    // Make sure to have the fresh props data for list items when children are changed (keeping aria-current up-to-date)
    const listItems = responsiveProps.items.map(item => {
      return validChildren.find(child => child.key === item.key) ?? item
    })

    // Make sure to have the fresh props data for menu items when children are changed (keeping aria-current up-to-date)
    const menuItems = responsiveProps.menuItems.map(menuItem => {
      return validChildren.find(child => child.key === menuItem.key) ?? menuItem
    })
    // This is the case where the viewport is too narrow to show any list item with the more menu. In this case, we only show the dropdown
    const onlyMenuVisible = responsiveProps.items.length === 0

    if (__DEV__) {
      // Practically, this is not a conditional hook, it is just making sure this hook runs only on DEV not PROD.
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        // Address illegal state where there are multiple items that have `aria-current='page'` attribute
        const activeElements = validChildren.filter(child => {
          return child.props['aria-current'] !== undefined
        })
        invariant(activeElements.length <= 1, 'Only one current element is allowed')
        invariant(ariaLabel, 'Use the `aria-label` prop to provide an accessible label for assistive technology')
      })
    }

    function getItemsWidth(itemText: string): number {
      return noIconChildWidthArray.find(item => item.text === itemText)?.width ?? 0
    }

    const swapMenuItemWithListItem = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prospectiveListItem: React.ReactElement<any>,
      indexOfProspectiveListItem: number,
      event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
      callback: (props: ResponsiveProps, displayIcons: boolean) => void,
    ) => {
      // get the selected menu item's width
      const widthToFitIntoList = getItemsWidth(prospectiveListItem.props.children)
      // Check if there is any empty space on the right side of the list
      const availableSpace =
        (navRef.current?.getBoundingClientRect().width ?? 0) - (listRef.current?.getBoundingClientRect().width ?? 0)

      // Calculate how many items need to be pulled in to the menu to make room for the selected menu item
      // I.e. if we need to pull 2 items in (index 0 and index 1), breakpoint (index) will return 1.
      const index = getBreakpointForItemSwapping(widthToFitIntoList, availableSpace)
      const indexToSliceAt = responsiveProps.items.length - 1 - index
      // Form the new list of items
      const itemsLeftInList = [...responsiveProps.items].slice(0, indexToSliceAt)
      const updatedItemList = [...itemsLeftInList, prospectiveListItem]
      // Form the new menu items
      const itemsToAddToMenu = [...responsiveProps.items].slice(indexToSliceAt)
      const updatedMenuItems = [...menuItems]
      // Add itemsToAddToMenu array's items to the menu at the index of the prospectiveListItem and remove 1 count of items (prospectiveListItem)
      updatedMenuItems.splice(indexOfProspectiveListItem, 1, ...itemsToAddToMenu)
      callback({items: updatedItemList, menuItems: updatedMenuItems}, false)
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

    const updateListAndMenu = useCallback((props: ResponsiveProps, displayIcons: boolean) => {
      setResponsiveProps(props)
      setIconsVisible(displayIcons)
      // Mark as ready after the first overflow calculation completes
      setIsReady(true)
    }, [])
    const setChildrenWidth = useCallback((size: ChildSize) => {
      setChildWidthArray(arr => {
        const newArr = [...arr, size]
        return newArr
      })
    }, [])

    const setNoIconChildrenWidth = useCallback((size: ChildSize) => {
      setNoIconChildWidthArray(arr => {
        const newArr = [...arr, size]
        return newArr
      })
    }, [])

    const closeOverlay = React.useCallback(() => {
      setIsWidgetOpen(false)
    }, [setIsWidgetOpen])

    const focusOnMoreMenuBtn = React.useCallback(() => {
      moreMenuBtnRef.current?.focus()
    }, [])

    const onAnchorClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.defaultPrevented || event.button !== 0) {
        return
      }
      setIsWidgetOpen(isWidgetOpen => !isWidgetOpen)
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

    useResizeObserver((resizeObserverEntries: ResizeObserverEntry[]) => {
      const navWidth = resizeObserverEntries[0].contentRect.width
      const moreMenuWidth = moreMenuRef.current?.getBoundingClientRect().width ?? 0
      navWidth !== 0 &&
        overflowEffect(
          navWidth,
          moreMenuWidth,
          validChildren,
          childWidthArray,
          noIconChildWidthArray,
          updateListAndMenu,
        )
    }, navRef as RefObject<HTMLElement>)

    // Compute menuInlineStyles if needed
    let menuInlineStyles: React.CSSProperties = {...baseMenuInlineStyles}
    if (containerRef.current && listRef.current) {
      const {left} = getAnchoredPosition(containerRef.current, listRef.current, {
        align: 'start',
        side: 'outside-bottom',
      })

      menuInlineStyles = {
        ...baseMenuInlineStyles,
        right: undefined,
        left,
      }
    }

    if (useResponsiveMode && responsiveOverflow) {
      // Get indices of items that need to be in the menu
      const responsiveMenuItemIndices = getResponsiveMenuItemIndices(responsiveOverflow, validChildren.length)
      const responsiveMenuItems = responsiveMenuItemIndices.map(index => ({
        index,
        child: validChildren[index],
      }))

      // Clone children with responsive data attributes
      const responsiveListItems = validChildren.map((child, index) => {
        const attrs = getResponsiveItemAttributes(responsiveOverflow, index)
        return React.cloneElement(child, {...attrs, key: child.key ?? index})
      })

      const menuContainerAttrs = getResponsiveMenuContainerAttributes(responsiveOverflow)
      const hasMenuItems = responsiveMenuItems.length > 0

      return (
        <UnderlineNavContext.Provider
          value={{
            setChildrenWidth,
            setNoIconChildrenWidth,
            loadingCounters,
            iconsVisible: true, // Icons are always visible in responsive mode
          }}
        >
          {ariaLabel && <VisuallyHidden as="h2">{`${ariaLabel} navigation`}</VisuallyHidden>}
          <UnderlineWrapper
            as={as}
            aria-label={ariaLabel}
            className={className}
            ref={navRef}
            data-variant={variant}
            ready={true}
          >
            <UnderlineItemList ref={listRef} role="list">
              {responsiveListItems}
              {hasMenuItems && (
                <li
                  ref={moreMenuRef}
                  className={classes.ResponsiveOverflowContainer}
                  style={{alignItems: 'center', height: `${MORE_BTN_HEIGHT}px`}}
                  {...menuContainerAttrs}
                >
                  <div style={dividerStyles}></div>
                  <Button
                    ref={moreMenuBtnRef}
                    className={classes.MoreButton}
                    aria-controls={disclosureWidgetId}
                    aria-expanded={isWidgetOpen}
                    onClick={onAnchorClick}
                    trailingAction={TriangleDownIcon}
                  >
                    <span>
                      More<VisuallyHidden as="span">&nbsp;{`${ariaLabel} items`}</VisuallyHidden>
                    </span>
                  </Button>
                  <ActionList
                    selectionVariant="single"
                    ref={containerRef}
                    id={disclosureWidgetId}
                    style={{
                      ...(listRef.current?.clientWidth && listRef.current.clientWidth >= baseMenuMinWidth
                        ? baseMenuInlineStyles
                        : menuInlineStyles),
                      display: isWidgetOpen ? 'block' : 'none',
                    }}
                  >
                    {responsiveMenuItems.map(({index, child}) => {
                      const {children: menuItemChildren, counter, onSelect, ...menuItemProps} = child.props
                      const menuItemAttrs = getResponsiveMenuItemAttributes(responsiveOverflow, index)

                      return (
                        <ActionList.LinkItem
                          key={`menu-${index}-${menuItemChildren}`}
                          style={menuItemStyles}
                          onClick={(
                            event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
                          ) => {
                            closeOverlay()
                            focusOnMoreMenuBtn()
                            typeof onSelect === 'function' && onSelect(event)
                          }}
                          {...menuItemProps}
                          {...menuItemAttrs}
                        >
                          <span className={classes.MenuItemContent}>
                            {menuItemChildren}
                            {loadingCounters ? (
                              <LoadingCounter />
                            ) : (
                              counter !== undefined && (
                                <span data-component="counter">
                                  <CounterLabel>{counter}</CounterLabel>
                                </span>
                              )
                            )}
                          </span>
                        </ActionList.LinkItem>
                      )
                    })}
                  </ActionList>
                </li>
              )}
            </UnderlineItemList>
          </UnderlineWrapper>
        </UnderlineNavContext.Provider>
      )
    }

    // ============================================
    // Default JS-based overflow rendering
    // ============================================
    return (
      <UnderlineNavContext.Provider
        value={{
          setChildrenWidth,
          setNoIconChildrenWidth,
          loadingCounters,
          iconsVisible,
        }}
      >
        {ariaLabel && <VisuallyHidden as="h2">{`${ariaLabel} navigation`}</VisuallyHidden>}
        <UnderlineWrapper
          as={as}
          aria-label={ariaLabel}
          className={className}
          ref={navRef}
          data-variant={variant}
          ready={isReady}
        >
          <UnderlineItemList ref={listRef} role="list">
            {listItems}
            {menuItems.length > 0 && (
              <li ref={moreMenuRef} style={{display: 'flex', alignItems: 'center', height: `${MORE_BTN_HEIGHT}px`}}>
                {!onlyMenuVisible && <div style={dividerStyles}></div>}
                <Button
                  ref={moreMenuBtnRef}
                  className={classes.MoreButton}
                  aria-controls={disclosureWidgetId}
                  aria-expanded={isWidgetOpen}
                  onClick={onAnchorClick}
                  trailingAction={TriangleDownIcon}
                >
                  <span>
                    {onlyMenuVisible ? (
                      <>
                        <VisuallyHidden as="span">{`${ariaLabel}`}&nbsp;</VisuallyHidden>Menu
                      </>
                    ) : (
                      <>
                        More<VisuallyHidden as="span">&nbsp;{`${ariaLabel} items`}</VisuallyHidden>
                      </>
                    )}
                  </span>
                </Button>
                <ActionList
                  selectionVariant="single"
                  ref={containerRef}
                  id={disclosureWidgetId}
                  style={{
                    ...(listRef.current?.clientWidth && listRef.current.clientWidth >= baseMenuMinWidth
                      ? baseMenuInlineStyles
                      : menuInlineStyles),
                    display: isWidgetOpen ? 'block' : 'none',
                  }}
                >
                  {menuItems.map((menuItem, index) => {
                    const {
                      children: menuItemChildren,
                      counter,
                      'aria-current': ariaCurrent,
                      onSelect,
                      ...menuItemProps
                    } = menuItem.props

                    // This logic is used to pop the selected item out of the menu and into the list when the navigation is control externally
                    if (Boolean(ariaCurrent) && ariaCurrent !== 'false') {
                      const event = new MouseEvent('click')
                      !onlyMenuVisible &&
                        swapMenuItemWithListItem(
                          menuItem,
                          index,
                          // @ts-ignore - not a big deal because it is internally creating an event but ask help
                          event as React.MouseEvent<HTMLAnchorElement>,
                          updateListAndMenu,
                        )
                    }

                    return (
                      <ActionList.LinkItem
                        key={menuItemChildren}
                        style={menuItemStyles}
                        onClick={(
                          event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
                        ) => {
                          // When there are no items in the list, do not run the swap function as we want to keep everything in the menu.
                          !onlyMenuVisible && swapMenuItemWithListItem(menuItem, index, event, updateListAndMenu)
                          closeOverlay()
                          focusOnMoreMenuBtn()
                          // fire onSelect event that comes from the UnderlineNav.Item (if it is defined)
                          typeof onSelect === 'function' && onSelect(event)
                        }}
                        {...menuItemProps}
                      >
                        <span className={classes.MenuItemContent}>
                          {menuItemChildren}
                          {loadingCounters ? (
                            <LoadingCounter />
                          ) : (
                            counter !== undefined && (
                              <span data-component="counter">
                                <CounterLabel>{counter}</CounterLabel>
                              </span>
                            )
                          )}
                        </span>
                      </ActionList.LinkItem>
                    )
                  })}
                </ActionList>
              </li>
            )}
          </UnderlineItemList>
        </UnderlineWrapper>
      </UnderlineNavContext.Provider>
    )
  },
)

UnderlineNav.displayName = 'UnderlineNav'
