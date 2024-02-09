/*
TODO
- Decide props for ActionBar
- Add api docs
- Add proper types\
Bugs
- Nothing in More items
- Divider is loopy
*/

import React, {useState, useCallback, useRef, forwardRef, RefObject, MutableRefObject} from 'react'
import VisuallyHidden from '../_VisuallyHidden'
import {ActionList} from '../ActionList'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {MORE_BTN_WIDTH, NavigationList, MoreMenuListItem} from '../UnderlineNav/UnderlineNav'
import {ulStyles, moreBtnStyles, menuStyles, menuItemStyles} from '../UnderlineNav/styles'
import {useOnEscapePress} from '../hooks/useOnEscapePress'
import {useResizeObserver, ResizeObserverEntry} from '../hooks/useResizeObserver'
import {TriangleDownIcon} from '@primer/octicons-react'
import {useOnOutsideClick} from '../hooks/useOnOutsideClick'
//import styled from 'styled-components'
import {IconButton, IconButtonProps, Button} from '../Button'
import Box from '../Box'

// import {get} from '../constants'
//import sx, {BetterCssProperties, BetterSystemStyleObject, SxProp, merge} from '../sx'
// import {ComponentProps} from '../utils/types'
// import {ResponsiveValue, isResponsiveValue} from '../hooks/useResponsiveValue'
// import {getBreakpointDeclarations} from '../utils/getBreakpointDeclarations'
// import {defaultSxProp} from '../utils/defaultSxProp'

type ChildSize = {
  text: string
  width: number
}
type ChildWidthArray = Array<ChildSize>
type ResponsiveProps = {
  items: Array<React.ReactElement>
  menuItems: Array<React.ReactElement>
}

const ActionBarContext = React.createContext<{
  size: Size
  setChildrenWidth: React.Dispatch<{text: string; width: number}>
}>({size: 'medium', setChildrenWidth: () => null})

/*
small (28px), medium (32px), large (40px)
*/
type Size = 'small' | 'medium' | 'large'

export type ActionBarProps = {
  size?: Size
  'aria-label'?: React.AriaAttributes['aria-label']
  children: React.ReactNode
}

export type ActionBarIconButtonProps = IconButtonProps

const getNavStyles = () => ({
  display: 'flex',
  paddingX: 3,
  justifyContent: 'flex-start',
  align: 'row',
  alignItems: 'center',
  minHeight: '48px',
})

const getValidChildren = (children: React.ReactNode) => {
  return React.Children.toArray(children).filter(child => {
    // only icon buttons for now. Expand to other buttons later
    return React.isValidElement(child) && child.props.icon ? true : false
  }) as React.ReactElement[]
}

const calculatePossibleItems = (childWidthArray: ChildWidthArray, navWidth: number, moreMenuWidth = 0) => {
  const widthToFit = navWidth - moreMenuWidth
  let breakpoint = childWidthArray.length // assume all items will fit
  let sumsOfChildWidth = 0
  for (const [index, childWidth] of childWidthArray.entries()) {
    sumsOfChildWidth = sumsOfChildWidth + childWidth.width // + GAP
    if (sumsOfChildWidth > widthToFit) {
      breakpoint = index
      break
    } else {
      continue
    }
  }
  return breakpoint
}

const overflowEffect = (
  navWidth: number,
  moreMenuWidth: number,
  childArray: Array<React.ReactElement>,
  childWidthArray: ChildWidthArray,
  updateListAndMenu: (props: ResponsiveProps) => void,
) => {
  if (childWidthArray.length === 0) {
    updateListAndMenu({items: childArray, menuItems: []})
  }
  const numberOfItemsPossible = calculatePossibleItems(childWidthArray, navWidth)

  const numberOfItemsPossibleWithMoreMenu = calculatePossibleItems(
    childWidthArray,
    navWidth,
    moreMenuWidth || MORE_BTN_WIDTH,
  )
  const items: Array<React.ReactElement> = []
  const menuItems: Array<React.ReactElement> = []

  // First, we check if we can fit all the items with their icons
  if (childArray.length > numberOfItemsPossible) {
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

    updateListAndMenu({items, menuItems})
  }
}

export const ActionBar: React.FC<React.PropsWithChildren<ActionBarProps>> = props => {
  const {size = 'medium', children, 'aria-label': ariaLabel} = props
  const [childWidthArray, setChildWidthArray] = useState<ChildWidthArray>([])
  const setChildrenWidth = useCallback((size: ChildSize) => {
    setChildWidthArray(arr => {
      const newArr = [...arr, size]
      return newArr
    })
  }, [])

  const navRef = useRef<HTMLElement>(null) as MutableRefObject<HTMLElement>
  const listRef = useRef<HTMLUListElement>(null)
  const moreMenuRef = useRef<HTMLLIElement>(null)
  const moreMenuBtnRef = useRef<HTMLButtonElement>(null)
  const containerRef = React.useRef<HTMLUListElement>(null)
  const disclosureWidgetId = React.useId()

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

  function getItemsWidth(itemText: string): number {
    return childWidthArray.find(item => item.text === itemText)?.width ?? 0
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
      navRef.current.getBoundingClientRect().width - (listRef.current?.getBoundingClientRect().width ?? 0)

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

  const updateListAndMenu = useCallback((props: ResponsiveProps) => {
    setResponsiveProps(props)
  }, [])

  useResizeObserver((resizeObserverEntries: ResizeObserverEntry[]) => {
    const navWidth = resizeObserverEntries[0].contentRect.width
    const moreMenuWidth = moreMenuRef.current?.getBoundingClientRect().width ?? 0
    navWidth !== 0 && overflowEffect(navWidth, moreMenuWidth, validChildren, childWidthArray, updateListAndMenu)
  }, navRef as RefObject<HTMLElement>)

  const [isWidgetOpen, setIsWidgetOpen] = useState(false)

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

  return (
    <ActionBarContext.Provider value={{size, setChildrenWidth}}>
      <Box ref={navRef} sx={getNavStyles()}>
        <NavigationList sx={ulStyles} ref={listRef} role="list">
          {listItems}
          {menuItems.length > 0 && (
            <MoreMenuListItem ref={moreMenuRef}>
              <Button
                ref={moreMenuBtnRef}
                sx={moreBtnStyles}
                aria-controls={disclosureWidgetId}
                aria-expanded={isWidgetOpen}
                onClick={onAnchorClick}
                trailingAction={TriangleDownIcon}
              >
                <Box as="span">
                  More<VisuallyHidden as="span">&nbsp;{`${ariaLabel} items`}</VisuallyHidden>
                </Box>
              </Button>
              <ActionList
                selectionVariant="single"
                ref={containerRef}
                id={disclosureWidgetId}
                sx={menuStyles}
                style={{display: isWidgetOpen ? 'block' : 'none'}}
              >
                {menuItems.map((menuItem, index) => {
                  const {
                    children: menuItemChildren,
                    //'aria-current': ariaCurrent,
                    onSelect,
                    ...menuItemProps
                  } = menuItem.props

                  return (
                    <ActionList.LinkItem
                      key={menuItemChildren}
                      sx={menuItemStyles}
                      onClick={(
                        event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
                      ) => {
                        // When there are no items in the list, do not run the swap function as we want to keep everything in the menu.
                        swapMenuItemWithListItem(menuItem, index, event, updateListAndMenu)
                        closeOverlay()
                        focusOnMoreMenuBtn()
                        // fire onSelect event that comes from the UnderlineNav.Item (if it is defined)
                        typeof onSelect === 'function' && onSelect(event)
                      }}
                      {...menuItemProps}
                    ></ActionList.LinkItem>
                  )
                })}
              </ActionList>
            </MoreMenuListItem>
          )}
        </NavigationList>
      </Box>
    </ActionBarContext.Provider>
  )
}

export const ActionBarIconButton = forwardRef((props: ActionBarIconButtonProps, forwardedRef) => {
  const backupRef = useRef<HTMLElement>(null)
  const ref = (forwardedRef ?? backupRef) as RefObject<HTMLAnchorElement>
  const {size, setChildrenWidth} = React.useContext(ActionBarContext)
  useIsomorphicLayoutEffect(() => {
    const text = props.label
    const domRect = (ref as MutableRefObject<HTMLElement>).current.getBoundingClientRect()
    setChildrenWidth({text, width: domRect.width})
  }, [ref, setChildrenWidth])
  return (
    <IconButton
      ref={ref}
      //ariaLabel={props.label}
      data-component="ActionBar.IconButton"
      size={size}
      {...props}
      variant="invisible"
    />
  )
})

const sizeToHeight = {
  small: '24px',
  medium: '28px',
  large: '32px',
}
export const VerticalDivider = () => {
  const {size} = React.useContext(ActionBarContext)

  return (
    <Box
      data-component="ActionBar.VerticalDivider"
      aria-hidden="true"
      sx={{
        display: 'inline-block',
        borderLeft: '1px solid',
        borderColor: 'actionListItem.inlineDivider',
        height: sizeToHeight[size],
        mx: 2,
      }}
    />
  )
}
