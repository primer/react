import type {RefObject, MutableRefObject} from 'react'
import React, {useState, useCallback, useRef, forwardRef} from 'react'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {ActionList} from '../../ActionList'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import styled from 'styled-components'
import sx from '../../sx'
import {useOnEscapePress} from '../../hooks/useOnEscapePress'
import type {ResizeObserverEntry} from '../../hooks/useResizeObserver'
import {useResizeObserver} from '../../hooks/useResizeObserver'

import {useOnOutsideClick} from '../../hooks/useOnOutsideClick'
import type {IconButtonProps} from '../../Button'
import {IconButton} from '../../Button'
import Box from '../../Box'

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

const NavigationList = styled.ul`
  ${sx};
`

const MORE_BTN_HEIGHT = 45
const GAP = 8
const MoreMenuListItem = styled.li`
  display: flex;
  align-items: center;
  height: ${MORE_BTN_HEIGHT}px;
`

const ulStyles = {
  display: 'flex',
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

const menuStyles = {
  position: 'absolute',
  zIndex: 1,
  top: '90%',
  right: '0',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  borderRadius: '12px',
  backgroundColor: 'canvas.overlay',
  listStyle: 'none',
  // Values are from ActionMenu
  minWidth: '192px',
  maxWidth: '640px',
}

const MORE_BTN_WIDTH = 86
const getNavStyles = () => ({
  display: 'flex',
  paddingX: 3,
  justifyContent: 'flex-end',
  align: 'row',
  alignItems: 'center',
  maxHeight: '32px',
})

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
              <IconButton
                ref={moreMenuBtnRef}
                sx={moreBtnStyles}
                aria-controls={disclosureWidgetId}
                aria-expanded={isWidgetOpen}
                onClick={onAnchorClick}
                aria-label={`More ${ariaLabel} items`}
                icon={KebabHorizontalIcon}
              />
              <ActionList
                ref={containerRef}
                id={disclosureWidgetId}
                sx={menuStyles}
                style={{display: isWidgetOpen ? 'block' : 'none'}}
              >
                {menuItems.map((menuItem, index) => {
                  if (menuItem.type === ActionList.Divider) {
                    return <ActionList.Divider key={index} />
                  } else {
                    const {
                      children: menuItemChildren,
                      //'aria-current': ariaCurrent,
                      onSelect,
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
                          typeof onSelect === 'function' && onSelect(event)
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
