import {clsx} from 'clsx'
import type {To} from 'history'
import React, {useState, useRef, useCallback, useEffect} from 'react'
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
          aria-label={ariaLabel || `${items.length} more items`}
          variant="invisible"
          style={{display: 'inline-flex'}}
          {...rest}
        >
          …
        </ActionMenu.Button>
        <ActionMenu.Overlay width="auto">
          <ActionList>
            {items.map((item, index) => {
              const href = item.props.href
              const children = item.props.children
              const selected = item.props.selected
              return (
                <ActionList.LinkItem
                  key={index}
                  href={href}
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

function Breadcrumbs({className, children, sx: sxProp, overflow = 'wrap', hideRoot = true}: BreadcrumbsProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [visibleItems, setVisibleItems] = useState<React.ReactElement[]>([])
  const [menuItems, setMenuItems] = useState<React.ReactElement[]>([])
  const [itemWidths, setItemWidths] = useState<number[]>([])
  const previousWidthsRef = useRef<string>('')

  const childArray = React.Children.toArray(children).filter(child =>
    React.isValidElement(child),
  ) as React.ReactElement[]

  // Initialize visible items to show all items initially for measurement
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

  // Calculate item widths from rendered items using parent container
  useEffect(() => {
    if (containerRef.current && overflow === 'menu') {
      const listElement = containerRef.current.querySelector('ol')
      if (listElement && listElement.children.length > 0) {
        // Only measure widths when all original items are visible (no overflow menu yet)
        if (listElement.children.length === childArray.length) {
          const widths = Array.from(listElement.children).map(child => (child as HTMLElement).offsetWidth)
          const widthsString = JSON.stringify(widths)
          // Only update if widths have actually changed to prevent infinite loops
          if (widthsString !== previousWidthsRef.current) {
            previousWidthsRef.current = widthsString
            setItemWidths(widths)
          }
        }
      }
    }
  }, [childArray, overflow, visibleItems])

  // Calculate which items are visible vs in menu
  useEffect(() => {
    if (overflow === 'wrap') {
      setVisibleItems(childArray)
      setMenuItems([])
      return
    }

    // For 'menu' overflow mode
    const lastItem = childArray[childArray.length - 1] // Leaf breadcrumb
    const firstItem = childArray[0] // Root breadcrumb

    // First check: if more than 5 items, always use overflow
    if (childArray.length > 5) {
      if (hideRoot) {
        // Show only overflow menu and leaf breadcrumb
        const itemsToHide = childArray.slice(0, -1) // All except last
        setMenuItems(itemsToHide)
        setVisibleItems([lastItem])
      } else {
        // Show root breadcrumb, overflow menu, and leaf breadcrumb
        const itemsToHide = childArray.slice(1, -1) // All except first and last
        setMenuItems(itemsToHide)
        setVisibleItems([firstItem, lastItem])
      }
      return
    }

    // Second check: if we have measured widths and container width, check if items fit
    if (containerWidth > 0 && itemWidths.length === childArray.length && itemWidths.length > 0) {
      const totalItemsWidth = itemWidths.reduce((sum, width) => sum + width, 0)
      // Add some buffer for the ellipsis menu button (approximately 50px)
      const bufferWidth = 50

      if (totalItemsWidth + bufferWidth > containerWidth) {
        // Items don't fit, need to overflow
        if (hideRoot) {
          // Show only overflow menu and leaf breadcrumb
          const itemsToHide = childArray.slice(0, -1) // All except last
          setMenuItems(itemsToHide)
          setVisibleItems([lastItem])
        } else {
          // Show root breadcrumb, overflow menu, and leaf breadcrumb
          const itemsToHide = childArray.slice(1, -1) // All except first and last
          setMenuItems(itemsToHide)
          setVisibleItems([firstItem, lastItem])
        }
        return
      }
    }

    // No overflow needed - show all items
    setVisibleItems(childArray)
    setMenuItems([])
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

    // Position menu based on hideRoot setting and visible items
    if (hideRoot) {
      // Show: [overflow menu, leaf breadcrumb]
      return [menuElement, ...visibleElements]
    } else {
      // Show: [root breadcrumb, overflow menu, leaf breadcrumb]
      return [visibleElements[0], menuElement, ...visibleElements.slice(1)]
    }
  }, [overflow, menuItems, visibleItems, hideRoot])

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
