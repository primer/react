import type {RefObject, MutableRefObject} from 'react'
import React, {useState, useCallback, useRef, forwardRef} from 'react'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {ActionList} from '../ActionList'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import styled from 'styled-components'
import sx from '../sx'
import {useOnEscapePress} from '../hooks/useOnEscapePress'
import type {ResizeObserverEntry} from '../hooks/useResizeObserver'
import {useResizeObserver} from '../hooks/useResizeObserver'

import {useOnOutsideClick} from '../hooks/useOnOutsideClick'
import type {IconButtonProps} from '../Button'
import {IconButton} from '../Button'
import Box from '../Box'
import {ActionMenu} from '../ActionMenu'
import {useFocusZone, FocusKeys} from '../hooks/useFocusZone'

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

type A11yProps =
  | {'aria-label': React.AriaAttributes['aria-label']; 'aria-labelledby'?: undefined}
  | {'aria-label'?: undefined; 'aria-labelledby': React.AriaAttributes['aria-labelledby']}

export type ActionBarProps = {
  size?: Size
  children: React.ReactNode
} & A11yProps

export type ActionBarIconButtonProps = IconButtonProps

const NavigationList = styled.div`
  ${sx};
`

const GAP = 8

const listStyles = {
  display: 'flex',
  minWidth: 0,
  listStyle: 'none',
  whiteSpace: 'nowrap',
  paddingY: 0,
  paddingX: 0,
  margin: 0,
  marginBottom: '-1px',
  alignItems: 'center',
  gap: `${GAP}px`,
  position: 'relative',
}

const MORE_BTN_WIDTH = 86
const navStyles = {
  display: 'flex',
  paddingX: 3,
  justifyContent: 'flex-end',
  align: 'row',
  alignItems: 'center',
  maxHeight: '32px',
}

const menuItemStyles = {
  textDecoration: 'none',
}

const moreBtnStyles = {
  //set margin 0 here because safari puts extra margin around the button, rest is to reset style to make it look like a list element
  margin: 0,
  border: 0,
  background: 'transparent',
  fontWeight: 'normal',
  boxShadow: 'none',
  paddingY: 1,
  paddingX: 2,
}

const getValidChildren = (children: React.ReactNode) => {
  return React.Children.toArray(children).filter(child => {
    return React.isValidElement(child)
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
        //if the last item is a divider
      } else if (childWidthArray[index].text === 'divider') {
        if (index === numberOfListItems - 1 || index === numberOfListItems) {
          continue
        } else {
          const divider = React.createElement(ActionList.Divider, {key: index})
          menuItems.push(divider)
        }
      } else {
        menuItems.push(child)
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

  const navRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLLIElement>(null)
  const moreMenuBtnRef = useRef<HTMLButtonElement>(null)
  const containerRef = React.useRef<HTMLUListElement>(null)

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

  useFocusZone({
    containerRef: listRef,
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusOutBehavior: 'wrap',
  })

  return (
    <ActionBarContext.Provider value={{size, setChildrenWidth}}>
      <Box ref={navRef} sx={navStyles}>
        <NavigationList sx={listStyles} ref={listRef} role="toolbar">
          {listItems}
          {menuItems.length > 0 && (
            <ActionMenu>
              <ActionMenu.Anchor>
                <IconButton sx={moreBtnStyles} aria-label={`More ${ariaLabel} items`} icon={KebabHorizontalIcon} />
              </ActionMenu.Anchor>
              <ActionMenu.Overlay>
                <ActionList>
                  {menuItems.map((menuItem, index) => {
                    if (menuItem.type === ActionList.Divider) {
                      return <ActionList.Divider key={index} />
                    } else {
                      const {
                        children: menuItemChildren,
                        //'aria-current': ariaCurrent,
                        onClick,
                        icon: Icon,
                        'aria-label': ariaLabel,
                      } = menuItem.props
                      return (
                        <ActionList.LinkItem
                          key={menuItemChildren}
                          sx={menuItemStyles}
                          onClick={(
                            event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
                          ) => {
                            closeOverlay()
                            focusOnMoreMenuBtn()
                            typeof onClick === 'function' && onClick(event)
                          }}
                        >
                          {Icon ? (
                            <ActionList.LeadingVisual>
                              <Icon />
                            </ActionList.LeadingVisual>
                          ) : null}
                          {ariaLabel}
                        </ActionList.LinkItem>
                      )
                    }
                  })}
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
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
    const text = props['aria-label'] ? props['aria-label'] : ''
    const domRect = (ref as MutableRefObject<HTMLElement>).current.getBoundingClientRect()
    setChildrenWidth({text, width: domRect.width})
  }, [ref, setChildrenWidth])
  return <IconButton ref={ref} size={size} {...props} variant="invisible" />
})

const sizeToHeight = {
  small: '24px',
  medium: '28px',
  large: '32px',
}
export const VerticalDivider = () => {
  const ref = useRef<HTMLDivElement>(null)
  const {size, setChildrenWidth} = React.useContext(ActionBarContext)
  useIsomorphicLayoutEffect(() => {
    const text = 'divider'
    const domRect = (ref as MutableRefObject<HTMLElement>).current.getBoundingClientRect()
    setChildrenWidth({text, width: domRect.width})
  }, [ref, setChildrenWidth])
  return (
    <Box
      ref={ref}
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
