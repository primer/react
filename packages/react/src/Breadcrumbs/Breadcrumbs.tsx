import {clsx} from 'clsx'
import React, {useEffect, useRef, useState, useCallback, forwardRef, useContext} from 'react'
import type {RefObject, MutableRefObject} from 'react'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import type {SxProp} from '../sx'
import type {ComponentProps} from '../utils/types'
import classes from './Breadcrumbs.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {toggleSxComponent} from '../internal/utils/toggleSxComponent'
import {ActionMenu, ActionList} from '../'
import {IconButton} from '../Button'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {useOnEscapePress} from '../hooks/useOnEscapePress'
import type {ResizeObserverEntry} from '../hooks/useResizeObserver'
import {useResizeObserver} from '../hooks/useResizeObserver'
import {useOnOutsideClick} from '../hooks/useOnOutsideClick'
import {useFocusZone, FocusKeys} from '../hooks/useFocusZone'

interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

export type BreadcrumbsProps = {
  className?: string
  items?: BreadcrumbItem[]
  children?: React.ReactNode
  responsive?: boolean
} & SxProp

type ChildSize = {
  text: string
  width: number
}
type ChildWidthArray = Array<ChildSize>
type ResponsiveProps = {
  items: Array<React.ReactElement>
  menuItems: Array<React.ReactElement>
}

const BreadcrumbsContext = React.createContext<{
  setChildrenWidth: React.Dispatch<{text: string; width: number}>
}>({setChildrenWidth: () => null})

const MORE_BTN_WIDTH = 86
const GAP = 8

const getValidChildren = (children: React.ReactNode) => {
  return React.Children.toArray(children).filter(child => {
    return React.isValidElement(child)
  }) as React.ReactElement[]
}

const calculatePossibleItems = (childWidthArray: ChildWidthArray, navWidth: number, moreMenuWidth = 0) => {
  const widthToFit = navWidth - moreMenuWidth
  let breakpoint = childWidthArray.length
  let sumsOfChildWidth = 0
  for (const [index, childWidth] of childWidthArray.entries()) {
    sumsOfChildWidth += childWidth.width + GAP
    if (sumsOfChildWidth > widthToFit) {
      breakpoint = index
      break
    }
  }
  return breakpoint
}

const overflowEffect = (navWidth, moreMenuWidth, childArray, childWidthArray, updateListAndMenu, hasActiveMenu) => {
  console.log('navWidth:', navWidth)
  console.log('moreMenuWidth:', moreMenuWidth)
  console.log('childWidthArray:', childWidthArray)

  if (childWidthArray.length === 0) {
    updateListAndMenu({items: childArray, menuItems: []})
  }
  const numberOfItemsPossible = calculatePossibleItems(childWidthArray, navWidth)
  const numberOfItemsPossibleWithMoreMenu = calculatePossibleItems(
    childWidthArray,
    navWidth,
    moreMenuWidth || MORE_BTN_WIDTH,
  )

  console.log('Possible items without menu:', numberOfItemsPossible)
  console.log('Possible items with menu:', numberOfItemsPossibleWithMoreMenu)

  const items = []
  const menuItems = []

  if (childArray.length >= numberOfItemsPossible) {
    const numberOfItemsInMenu = childArray.length - numberOfItemsPossibleWithMoreMenu
    const numberOfListItems =
      numberOfItemsInMenu === 1 ? numberOfItemsPossibleWithMoreMenu - 1 : numberOfItemsPossibleWithMoreMenu

    for (const [index, child] of childArray.entries()) {
      if (index < numberOfItemsInMenu) {
        menuItems.push(child) // Add items to the menu starting from the first
      } else {
        items.push(child) // Add remaining items to the nav
      }
    }

    updateListAndMenu({items, menuItems})
  } else if (numberOfItemsPossible > childArray.length && hasActiveMenu) {
    updateListAndMenu({items: childArray, menuItems: []})
  }

  console.log('Visible items:', items.length)
  console.log('Menu items:', menuItems.length)
}

const BreadcrumbsList = ({children}: React.PropsWithChildren) => {
  return <ol className={classes.BreadcrumbsList}>{children}</ol>
}

const BreadcrumbsItemBaseComponent = toggleSxComponent('a') as React.ComponentType<StyledBreadcrumbsItemProps>
type StyledBreadcrumbsItemProps = {
  to?: string
  selected?: boolean
  className?: string
} & SxProp &
  React.HTMLAttributes<HTMLAnchorElement> &
  React.ComponentPropsWithRef<'a'>

const BreadcrumbsItem = React.forwardRef<HTMLAnchorElement, StyledBreadcrumbsItemProps>(
  ({selected, className, children, ...rest}, ref) => {
    const internalRef = useRef<HTMLAnchorElement>(null)
    const {setChildrenWidth} = useContext(BreadcrumbsContext)

    useEffect(() => {
      if (internalRef.current) {
        const width = internalRef.current.getBoundingClientRect().width
        const text = typeof children === 'string' ? children : internalRef.current.textContent || ''
        setChildrenWidth({text, width})

        console.log('Measured item:', {text, width})
      }
    }, [children, setChildrenWidth])

    return (
      <BreadcrumbsItemBaseComponent
        className={clsx(className, classes.Item, {
          [classes.ItemSelected]: selected,
        })}
        aria-current={selected ? 'page' : undefined}
        ref={(node: HTMLAnchorElement) => {
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLAnchorElement>).current = node
          internalRef.current = node
        }}
        {...rest}
      >
        {children}
      </BreadcrumbsItemBaseComponent>
    )
  },
) as PolymorphicForwardRefComponent<'a', StyledBreadcrumbsItemProps>

BreadcrumbsItem.displayName = 'Breadcrumbs.Item'

export type BreadcrumbsItemProps = ComponentProps<typeof BreadcrumbsItem>

const BreadcrumbsBaseComponent = toggleSxComponent('nav') as React.ForwardRefExoticComponent<
  BreadcrumbsProps & React.RefAttributes<HTMLElement>
>

export const Breadcrumbs: React.FC<React.PropsWithChildren<BreadcrumbsProps>> = ({className, sx: sxProp, children}) => {
  const [childWidthArray, setChildWidthArray] = useState<ChildWidthArray>([])
  const setChildrenWidth = useCallback((size: ChildSize) => {
    setChildWidthArray(arr => [...arr, size])
  }, [])

  const navRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLLIElement>(null)
  const moreMenuBtnRef = useRef<HTMLButtonElement>(null)

  const validChildren = getValidChildren(children)

  const [responsiveProps, setResponsiveProps] = useState<ResponsiveProps>({
    items: validChildren,
    menuItems: [],
  })

  const listItems = responsiveProps.items.map(item => {
    return validChildren.find(child => child.key === item.key) ?? item
  })

  const menuItems = responsiveProps.menuItems.map(menuItem => {
    return validChildren.find(child => child.key === menuItem.key) ?? menuItem
  })

  const updateListAndMenu = useCallback((props: ResponsiveProps) => {
    setResponsiveProps(props)
  }, [])

  useEffect(() => {
    setChildWidthArray([])
  }, [validChildren.length])

  useResizeObserver((entries: ResizeObserverEntry[]) => {
    const navWidth = entries[0].contentRect.width
    const moreMenuWidth = moreMenuRef.current?.getBoundingClientRect().width ?? 0
    const hasActiveMenu = menuItems.length > 0

    console.log('Container width:', navWidth)

    if (navWidth > 0) {
      overflowEffect(navWidth, moreMenuWidth, validChildren, childWidthArray, updateListAndMenu, hasActiveMenu)
    }
  }, navRef)

  useEffect(() => {
    console.table(childWidthArray)
  }, [childWidthArray])

  useEffect(() => {
    if (childWidthArray.length === validChildren.length) {
      console.log('Child width array fully populated:', childWidthArray)
      const navWidth = navRef.current?.getBoundingClientRect().width || 0
      const moreMenuWidth = moreMenuRef.current?.getBoundingClientRect().width || 0
      const hasActiveMenu = menuItems.length > 0

      overflowEffect(navWidth, moreMenuWidth, validChildren, childWidthArray, updateListAndMenu, hasActiveMenu)
    }
  }, [childWidthArray, validChildren, menuItems, updateListAndMenu])

  const [isWidgetOpen, setIsWidgetOpen] = useState(false)

  const closeOverlay = useCallback(() => {
    setIsWidgetOpen(false)
  }, [])

  const focusOnMoreMenuBtn = useCallback(() => {
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

  useOnOutsideClick({onClickOutside: closeOverlay, containerRef: navRef, ignoreClickRefs: [moreMenuBtnRef]})

  useFocusZone({
    containerRef: listRef,
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusOutBehavior: 'wrap',
  })

  return (
    <BreadcrumbsContext.Provider value={{setChildrenWidth}}>
      <nav
        className={clsx(className, classes.BreadcrumbsBase)}
        aria-label="Breadcrumbs"
        ref={navRef}
        // sx={sxProp}
      >
        <BreadcrumbsList>
          {menuItems.length > 0 && (
            <li className={classes.ItemWrapper}>
              <ActionMenu>
                <ActionMenu.Anchor>
                  <IconButton
                    ref={moreMenuBtnRef}
                    variant="invisible"
                    aria-label="More breadcrumb items"
                    icon={KebabHorizontalIcon}
                  />
                </ActionMenu.Anchor>
                <ActionMenu.Overlay>
                  <ActionList>
                    {menuItems.map((menuItem, index) => (
                      <ActionList.Item key={index} as="a">
                        {menuItem}
                      </ActionList.Item>
                    ))}
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
            </li>
          )}
          {listItems.map((item, index) => (
            <li key={index} className={classes.ItemWrapper}>
              {item}
            </li>
          ))}
        </BreadcrumbsList>
      </nav>
    </BreadcrumbsContext.Provider>
  )
}

export default Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})

export const Breadcrumb = Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})
export type BreadcrumbProps = BreadcrumbsProps
export type BreadcrumbItemProps = ComponentProps<typeof BreadcrumbsItem>
