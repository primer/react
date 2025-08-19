import {clsx} from 'clsx'
import type {To} from 'history'
import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react'
import type {SxProp} from '../sx'
import type {ComponentProps} from '../utils/types'
import classes from './Breadcrumbs.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import {IconButton} from '../Button/IconButton'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {useResizeObserver} from '../hooks/useResizeObserver'
import type {ResizeObserverEntry} from '../hooks/useResizeObserver'

const SELECTED_CLASS = 'selected'

export type BreadcrumbsProps = React.PropsWithChildren<
  {
    className?: string
    overflow?: 'wrap' | 'menu'
    hideRoot?: boolean
  } & SxProp
>

const BreadcrumbsList = ({children}: React.PropsWithChildren) => {
  return <ol className={classes.BreadcrumbsList}>{children}</ol>
}

type BreadcrumbsMenuItemProps = {
  items: React.ReactElement[]
  'aria-label'?: string
}

const BreadcrumbsMenuItem = React.forwardRef<HTMLButtonElement, BreadcrumbsMenuItemProps>(
  ({items, 'aria-label': ariaLabel, ...rest}, ref) => {
    return (
      <ActionMenu>
        <ActionMenu.Anchor>
          <IconButton
            ref={ref}
            aria-label={ariaLabel || `${items.length} more breadcrumb items`}
            aria-expanded="false"
            variant="invisible"
            size="small"
            icon={KebabHorizontalIcon}
            className={classes.MenuButton}
            {...rest}
          />
        </ActionMenu.Anchor>
        <ActionMenu.Overlay width="auto">
          <ActionList role="menu">
            {items.map((item, index) => {
              const href = item.props.href
              const children = item.props.children
              const selected = item.props.selected
              return (
                <ActionList.LinkItem
                  key={index}
                  href={href}
                  role="menuitem"
                  aria-current={selected ? 'page' : undefined}
                  className={selected ? classes.ItemSelected : undefined}
                >
                  {children}
                </ActionList.LinkItem>
              )
            })}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    )
  },
)

BreadcrumbsMenuItem.displayName = 'Breadcrumbs.MenuItem'

const getValidChildren = (children: React.ReactNode) => {
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement[]
}

function Breadcrumbs({className, children, sx: sxProp, overflow = 'wrap', hideRoot = true}: BreadcrumbsProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [effectiveHideRoot, setEffectiveHideRoot] = useState<boolean>(hideRoot)
  let effectiveOverflow = 'wrap'

  const childArray = useMemo(() => getValidChildren(children), [children])

  const rootItem = childArray[0]

  const [visibleItems, setVisibleItems] = useState<React.ReactElement[]>(() => childArray)
  const [childArrayWidths, setChildArrayWidths] = useState<number[]>(() => [])

  const [menuItems, setMenuItems] = useState<React.ReactElement[]>([])
  const [rootItemWidth, setRootItemWidth] = useState<number>(0)

  // SSR friendly
  if (typeof window !== 'undefined') {
    effectiveOverflow = overflow
  }
  const MIN_VISIBLE_ITEMS = !effectiveHideRoot ? 3 : 4

  useEffect(() => {
    const listElement = containerRef.current?.querySelector('ol')
    if (listElement && listElement.children.length > 0) {
      const listElementArray = Array.from(listElement.children) as HTMLElement[]
      const widths = listElementArray.map(child => child.offsetWidth)
      setChildArrayWidths(widths)
      setRootItemWidth(listElementArray[0].offsetWidth)
    }
  }, [childArray.length])

  const calculateOverflow = useCallback(
    (availableWidth: number) => {
      const MENU_BUTTON_WIDTH = 50 // Approximate width of "..." button

      const calculateVisibleItemsWidth = (w: number[]) => {
        const widths = w.reduce((sum, width) => sum + width + 16, 0)
        return !effectiveHideRoot ? rootItemWidth + widths : widths
      }

      let currentVisibleItems = [...childArray]
      let currentVisibleItemWidths = [...childArrayWidths]
      let currentMenuItems: React.ReactElement[] = []
      let currentMenuItemsWidths: number[] = []
      let eHideRoot = effectiveHideRoot

      if (availableWidth > 0 && currentVisibleItemWidths.length > 0) {
        let visibleItemsWidthTotal = calculateVisibleItemsWidth(currentVisibleItemWidths)

        // Add menu button width if we have hidden items
        if (currentMenuItems.length > 0) {
          visibleItemsWidthTotal += MENU_BUTTON_WIDTH
        }
        while (
          overflow === 'menu' &&
          (visibleItemsWidthTotal > availableWidth || currentVisibleItems.length > MIN_VISIBLE_ITEMS)
        ) {
          // Remove the last visible item
          const itemToHide = currentVisibleItems.slice(0)[0]
          const itemToHideWidth = currentVisibleItemWidths.slice(0)[0]
          currentMenuItems = [...currentMenuItems, itemToHide]
          currentMenuItemsWidths = [...currentMenuItemsWidths, itemToHideWidth]
          currentVisibleItems = [...currentVisibleItems.slice(1)]
          currentVisibleItemWidths = [...currentVisibleItemWidths.slice(1)]

          visibleItemsWidthTotal = calculateVisibleItemsWidth(currentVisibleItemWidths)

          // Add menu button width
          if (currentMenuItems.length > 0) {
            visibleItemsWidthTotal += MENU_BUTTON_WIDTH
          }

          // If hideRoot is false but we still don't fit with root + menu + leaf,
          // fallback to hideRoot=true behavior (menu + leaf only)
          if (!hideRoot && currentVisibleItems.length === 1 && visibleItemsWidthTotal > availableWidth) {
            eHideRoot = true
            break
          } else {
            eHideRoot = hideRoot
          }
        }
      }
      return {
        visibleItems: [...currentVisibleItems],
        menuItems: [...currentMenuItems],
        effectiveHideRoot: eHideRoot,
      }
    },
    [MIN_VISIBLE_ITEMS, childArray, childArrayWidths, effectiveHideRoot, hideRoot, overflow, rootItemWidth],
  )

  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (entries[0]) {
        const containerWidth = entries[0].contentRect.width
        const result = calculateOverflow(containerWidth)
        setVisibleItems(result.visibleItems)
        setMenuItems(result.menuItems)
        setEffectiveHideRoot(result.effectiveHideRoot)
      }
    },
    [calculateOverflow],
  )

  useResizeObserver(handleResize, containerRef)

  // Determine final children to render
  const finalChildren = React.useMemo(() => {
    if (effectiveOverflow === 'wrap' || menuItems.length === 0) {
      return visibleItems.map((child, index) => (
        <li className={classes.ItemWrapper} key={`visible + ${index}`}>
          {child}
        </li>
      ))
    }

    let effectiveMenuItems = [...menuItems]
    if (!effectiveHideRoot) {
      effectiveMenuItems = [...menuItems.slice(1)]
    }
    const menuElement = (
      <li className={classes.ItemWrapper} key="breadcrumbs-menu">
        <BreadcrumbsMenuItem
          items={effectiveMenuItems}
          aria-label={`${effectiveMenuItems.length} more breadcrumb items`}
        />
      </li>
    )

    const visibleElements = visibleItems.map((child, index) => (
      <li className={classes.ItemWrapper} key={`visible + ${index}`}>
        {child}
      </li>
    ))

    const rootElement = (
      <li className={classes.ItemWrapper} key={`rootElement`}>
        {rootItem}
      </li>
    )

    // Position menu based on effective hideRoot setting and visible items
    if (effectiveHideRoot) {
      // Show: [overflow menu, leaf breadcrumb]
      return [menuElement, ...visibleElements]
    } else {
      // Show: [root breadcrumb, overflow menu, leaf breadcrumb]
      return [rootElement, menuElement, ...visibleElements]
    }
  }, [effectiveOverflow, menuItems, visibleItems, rootItem, effectiveHideRoot])

  return (
    <BoxWithFallback
      as="nav"
      className={clsx(className, classes.BreadcrumbsBase)}
      aria-label="Breadcrumbs"
      sx={sxProp}
      ref={containerRef}
      data-overflow={effectiveOverflow}
    >
      <BreadcrumbsList>{finalChildren}</BreadcrumbsList>
    </BoxWithFallback>
  )
}

type StyledBreadcrumbsItemProps = {
  to?: To
  selected?: boolean
  className?: string
} & SxProp &
  React.HTMLAttributes<HTMLAnchorElement> &
  React.ComponentPropsWithRef<'a'>

const BreadcrumbsItem = React.forwardRef(({selected, className, ...rest}, ref) => {
  return (
    <BoxWithFallback
      as="a"
      className={clsx(className, classes.Item, {
        [SELECTED_CLASS]: selected,
        [classes.ItemSelected]: selected,
      })}
      aria-current={selected ? 'page' : undefined}
      ref={ref}
      {...rest}
    />
  )
}) as PolymorphicForwardRefComponent<'a', StyledBreadcrumbsItemProps>

Breadcrumbs.displayName = 'Breadcrumbs'

BreadcrumbsItem.displayName = 'Breadcrumbs.Item'

export type BreadcrumbsItemProps = ComponentProps<typeof BreadcrumbsItem>
export default Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})

/**
 * @deprecated Use the `Breadcrumbs` component instead (i.e. `<Breadcrumb>` → `<Breadcrumbs>`)
 */
export const Breadcrumb = Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})

/**
 * @deprecated Use the `BreadcrumbsProps` type instead
 */
export type BreadcrumbProps = BreadcrumbsProps

/**
 * @deprecated Use the `BreadcrumbsItemProps` type instead
 */
export type BreadcrumbItemProps = ComponentProps<typeof BreadcrumbsItem>
