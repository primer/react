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
        <ActionMenu.Button
          ref={ref}
          aria-label={ariaLabel || `${items.length} more breadcrumb items`}
          aria-expanded="false"
          variant="invisible"
          size="small"
          trailingAction={null}
          style={{display: 'inline-flex'}}
          {...rest}
        >
          …
        </ActionMenu.Button>
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
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [visibleItems, setVisibleItems] = useState<React.ReactElement[]>([])
  const [menuItems, setMenuItems] = useState<React.ReactElement[]>([])
  const [itemWidths, setItemWidths] = useState<number[]>([])
  const [effectiveHideRoot, setEffectiveHideRoot] = useState<boolean>(hideRoot)

  const childArray = useMemo(() => getValidChildren(children), [children])

  useEffect(() => {
    if (visibleItems.length === 0 && childArray.length > 0) {
      setVisibleItems(childArray)
    }
  }, [childArray, visibleItems.length])

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    if (entries[0]) {
      setContainerWidth(entries[0].contentRect.width)
    }
  }, [])

  useResizeObserver(handleResize, containerRef)

  useEffect(() => {
    if (childArray.length > 0) {
      if (overflow === 'wrap') {
        setVisibleItems(childArray)
        setMenuItems([])
        setEffectiveHideRoot(hideRoot)
        return
      }

      // For 'menu' overflow mode
      // Helper function to calculate visible items and menu items with progressive hiding
      const calculateOverflow = (availableWidth: number) => {
        const listElement = containerRef.current?.querySelector('ol')
        if (listElement && listElement.children.length > 0 && itemWidths.length === 0) {
          const widths = Array.from(listElement.children).map(child => (child as HTMLElement).offsetWidth)
          setItemWidths(widths)
        }
        const MENU_BUTTON_WIDTH = 50 // Approximate width of "..." button

        // Helper function to calculate total width of visible items
        const calculateVisibleItemsWidth = (items: React.ReactElement[]) => {
          return items
            .map((item, index) => {
              return itemWidths[index]
            })
            .reduce((sum, width) => sum + width, 0)
        }

        let currentVisibleItems = [...childArray]
        let currentMenuItems: React.ReactElement[] = []

        // If more than 5 items, start by reducing to 5 visible items (including menu)
        if (childArray.length > 5) {
          // Target: 4 visible items + 1 menu = 5 total
          const itemsToHide = childArray.slice(0, childArray.length - 4)
          currentMenuItems = itemsToHide
          currentVisibleItems = childArray.slice(childArray.length - 4)
        }
        let eHideRoot = hideRoot
        // Now check if current visible items fit in available width
        if (availableWidth > 0) {
          let visibleItemsWidthTotal = calculateVisibleItemsWidth(currentVisibleItems)

          // Add menu button width if we have hidden items
          if (currentMenuItems.length > 0) {
            visibleItemsWidthTotal += MENU_BUTTON_WIDTH
          }

          while (visibleItemsWidthTotal > availableWidth && currentVisibleItems.length > 1) {
            // Determine which item to hide based on hideRoot setting
            let itemToHide: React.ReactElement

            if (eHideRoot) {
              // Hide from start when hideRoot is true
              itemToHide = currentVisibleItems[0]
              currentVisibleItems = currentVisibleItems.slice(1)
            } else {
              // Try to hide second item (keep root and leaf) when hideRoot is false
              itemToHide = currentVisibleItems[1]
              currentVisibleItems = [currentVisibleItems[0], ...currentVisibleItems.slice(2)]
            }

            currentMenuItems = [itemToHide, ...currentMenuItems]

            visibleItemsWidthTotal = calculateVisibleItemsWidth(currentVisibleItems)

            // Add menu button width
            if (currentMenuItems.length > 0) {
              visibleItemsWidthTotal += MENU_BUTTON_WIDTH
            }

            // If hideRoot is false but we still don't fit with root + menu + leaf,
            // fallback to hideRoot=true behavior (menu + leaf only)
            if (
              !hideRoot &&
              !eHideRoot &&
              currentVisibleItems.length === 2 &&
              visibleItemsWidthTotal > availableWidth
            ) {
              eHideRoot = true
              const rootItem = currentVisibleItems[0]
              currentVisibleItems = currentVisibleItems.slice(1)
              currentMenuItems = [rootItem, ...currentMenuItems]

              visibleItemsWidthTotal = calculateVisibleItemsWidth(currentVisibleItems)

              if (currentMenuItems.length > 0) {
                visibleItemsWidthTotal += MENU_BUTTON_WIDTH
              }
            }
          }
        }
        return {
          visibleItems: currentVisibleItems,
          menuItems: currentMenuItems,
          effectiveHideRoot: eHideRoot,
        }
      }

      const result = calculateOverflow(containerWidth)
      setVisibleItems(result.visibleItems)
      setMenuItems(result.menuItems)
      setEffectiveHideRoot(result.effectiveHideRoot)
    }
  }, [childArray, overflow, containerWidth, hideRoot, itemWidths])

  // Determine final children to render
  const finalChildren = React.useMemo(() => {
    if (overflow === 'wrap' || menuItems.length === 0) {
      return visibleItems.map(child => (
        <li className={classes.ItemWrapper} key={child.key}>
          {child}
        </li>
      ))
    }

    // Create menu item and combine with visible items
    const menuElement = (
      <li className={classes.ItemWrapper} key="breadcrumbs-menu">
        <BreadcrumbsMenuItem items={menuItems} aria-label={`${menuItems.length} more breadcrumb items`} />
      </li>
    )

    const visibleElements = visibleItems.map(child => (
      <li className={classes.ItemWrapper} key={child.key}>
        {child}
      </li>
    ))

    // Position menu based on effective hideRoot setting and visible items
    if (effectiveHideRoot) {
      // Show: [overflow menu, leaf breadcrumb]
      return [menuElement, ...visibleElements]
    } else {
      // Show: [root breadcrumb, overflow menu, leaf breadcrumb]
      return [visibleElements[0], menuElement, ...visibleElements.slice(1)]
    }
  }, [overflow, menuItems, visibleItems, effectiveHideRoot])

  return (
    <BoxWithFallback
      as="nav"
      className={clsx(className, classes.BreadcrumbsBase)}
      aria-label="Breadcrumbs"
      sx={sxProp}
      ref={containerRef}
      data-overflow={overflow}
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
