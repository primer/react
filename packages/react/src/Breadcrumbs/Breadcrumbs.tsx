import {clsx} from 'clsx'
import type {To} from 'history'
import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react'
import type {SxProp} from '../sx'
import type {ComponentProps} from '../utils/types'
import classes from './Breadcrumbs.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'
import Details from '../Details'
import {ActionList} from '../ActionList'
import {IconButton} from '../Button/IconButton'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {useResizeObserver} from '../hooks/useResizeObserver'
import type {ResizeObserverEntry} from '../hooks/useResizeObserver'
import {useOnEscapePress} from '../hooks/useOnEscapePress'
import {useOnOutsideClick} from '../hooks/useOnOutsideClick'
import {getAnchoredPosition} from '@primer/behaviors'

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

const BreadcrumbsMenuItem = React.forwardRef<HTMLDetailsElement, BreadcrumbsMenuItemProps>(
  ({items, 'aria-label': ariaLabel, ...rest}, detailsRef) => {
    const [isOpen, setIsOpen] = useState(false)
    const [menuPosition, setMenuPosition] = useState<{top?: number; left?: number; right?: number}>({})

    const handleSummaryClick = useCallback(
      (event: React.MouseEvent) => {
        // Prevent the button click from bubbling up and interfering with details toggle
        event.preventDefault()
        // Manually toggle the details element
        if (detailsRef && 'current' in detailsRef && detailsRef.current) {
          const newOpenState = !detailsRef.current.open
          detailsRef.current.open = newOpenState
          setIsOpen(newOpenState)
        }
      },
      [detailsRef],
    )

    const closeOverlay = useCallback(() => {
      if (detailsRef && 'current' in detailsRef && detailsRef.current) {
        detailsRef.current.open = false
        setIsOpen(false)
      }
    }, [detailsRef])

    const focusOnMenuButton = useCallback(() => {
      iconButtonRef.current?.focus()
    }, [])

    const iconButtonRef = useRef<HTMLButtonElement>(null)
    const menuContainerRef = useRef<HTMLDivElement>(null)
    const summaryRef = useRef<HTMLElement>(null)

    // Calculate menu position when opening
    useEffect(() => {
      if (isOpen && summaryRef.current && menuContainerRef.current) {
        const {top, left} = getAnchoredPosition(summaryRef.current, menuContainerRef.current, {
          align: 'end',
          side: 'outside-bottom',
        })
        setMenuPosition({top, left})
      }
    }, [isOpen])

    useOnEscapePress(
      (event: KeyboardEvent) => {
        if (isOpen) {
          event.preventDefault()
          closeOverlay()
          focusOnMenuButton()
        }
      },
      [isOpen],
    )

    useOnOutsideClick({
      onClickOutside: closeOverlay,
      containerRef: menuContainerRef,
      ignoreClickRefs: [iconButtonRef],
    })

    return (
      <Details ref={detailsRef} className={classes.MenuDetails}>
        <Details.Summary ref={summaryRef} className={classes.MenuSummary} tabIndex={-1}>
          <IconButton
            ref={iconButtonRef}
            aria-label={ariaLabel || `${items.length} more breadcrumb items`}
            onClick={handleSummaryClick}
            variant="invisible"
            size="small"
            icon={KebabHorizontalIcon}
            {...rest}
          />
        </Details.Summary>
        <div ref={menuContainerRef} className={classes.MenuOverlay} style={menuPosition}>
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
                  className={classes.MenuItem}
                >
                  {children}
                </ActionList.LinkItem>
              )
            })}
          </ActionList>
        </div>
      </Details>
    )
  },
)

BreadcrumbsMenuItem.displayName = 'Breadcrumbs.MenuItem'

const getValidChildren = (children: React.ReactNode) => {
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement[]
}

function Breadcrumbs({className, children, sx: sxProp, overflow = 'wrap', hideRoot = true}: BreadcrumbsProps) {
  const containerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLDetailsElement>(null)
  const [effectiveHideRoot, setEffectiveHideRoot] = useState<boolean>(hideRoot)
  //let effectiveOverflow = 'wrap'
  const childArray = useMemo(() => getValidChildren(children), [children])

  const rootItem = childArray[0]

  const [visibleItems, setVisibleItems] = useState<React.ReactElement[]>(() => childArray)
  const [childArrayWidths, setChildArrayWidths] = useState<number[]>(() => [])

  const [menuItems, setMenuItems] = useState<React.ReactElement[]>([])
  const [rootItemWidth, setRootItemWidth] = useState<number>(0)

  // Menu button width with fallback
  const MENU_BUTTON_FALLBACK_WIDTH = 32 // Design system small IconButton
  const [menuButtonWidth, setMenuButtonWidth] = useState(MENU_BUTTON_FALLBACK_WIDTH)

  // if (typeof window !== 'undefined') {
  //   effectiveOverflow = overflow
  // }
  const MIN_VISIBLE_ITEMS = !effectiveHideRoot ? 3 : 4

  useEffect(() => {
    const listElement = containerRef.current?.querySelector('ol')
    if (listElement && listElement.children.length > 0 && listElement.children.length === childArray.length) {
      const listElementArray = Array.from(listElement.children) as HTMLElement[]
      const widths = listElementArray.map(child => child.offsetWidth)
      setChildArrayWidths(widths)
      setRootItemWidth(listElementArray[0].offsetWidth)
    }
  }, [childArray])

  // Measure actual menu button width when it exists
  useEffect(() => {
    if (menuButtonRef.current) {
      const iconButtonElement =
        menuButtonRef.current.querySelector('button[data-component="IconButton"]') ||
        menuButtonRef.current.querySelector('button')
      if (iconButtonElement) {
        const measuredWidth = (iconButtonElement as HTMLElement).offsetWidth
        if (measuredWidth > 0) {
          setMenuButtonWidth(measuredWidth)
        }
      }
    }
  }, [menuItems])

  const calculateOverflow = useCallback(
    (availableWidth: number) => {
      const MENU_BUTTON_WIDTH = menuButtonWidth // Use measured width with fallback

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
    [
      MIN_VISIBLE_ITEMS,
      childArray,
      childArrayWidths,
      effectiveHideRoot,
      hideRoot,
      overflow,
      rootItemWidth,
      menuButtonWidth,
    ],
  )

  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (entries[0]) {
        const containerWidth = entries[0].contentRect.width
        const result = calculateOverflow(containerWidth)
        if (
          visibleItems.length !== result.visibleItems.length ||
          menuItems.length !== result.menuItems.length ||
          effectiveHideRoot !== result.effectiveHideRoot
        ) {
          setVisibleItems(result.visibleItems)
          setMenuItems(result.menuItems)
          setEffectiveHideRoot(result.effectiveHideRoot)
        }
      }
    },
    [calculateOverflow, effectiveHideRoot, menuItems, visibleItems],
  )

  useResizeObserver(handleResize, containerRef)

  // Initial overflow calculation for testing and >5 items
  useEffect(() => {
    if (overflow === 'menu' && childArray.length > 5) {
      // Get actual container width from DOM or use default
      const containerWidth = containerRef.current?.offsetWidth || 800
      const result = calculateOverflow(containerWidth)
      setVisibleItems(result.visibleItems)
      setMenuItems(result.menuItems)
      setEffectiveHideRoot(result.effectiveHideRoot)
    }
  }, [overflow, childArray, calculateOverflow])

  // Determine final children to render
  const finalChildren = React.useMemo(() => {
    if (overflow === 'wrap' || menuItems.length === 0) {
      return React.Children.map(children, child => <li className={classes.ItemWrapper}>{child}</li>)
    }

    let effectiveMenuItems = [...menuItems]
    if (!effectiveHideRoot) {
      effectiveMenuItems = [...menuItems.slice(1)]
    }
    const menuElement = (
      <li className={classes.BreadcrumbsItem} key="breadcrumbs-menu">
        <BreadcrumbsMenuItem
          ref={menuButtonRef}
          items={effectiveMenuItems}
          aria-label={`${effectiveMenuItems.length} more breadcrumb items`}
        />
        <ItemSeparator />
      </li>
    )

    const visibleElements = visibleItems.map((child, index) => (
      <li className={classes.BreadcrumbsItem} key={`visible + ${index}`}>
        {child}
        <ItemSeparator />
      </li>
    ))

    const rootElement = (
      <li className={classes.BreadcrumbsItem} key={`rootElement`}>
        {rootItem}
        <ItemSeparator />
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
  }, [overflow, menuItems, effectiveHideRoot, visibleItems, rootItem, children])

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

const ItemSeparator = () => {
  return (
    <span className={classes.ItemSeparator}>
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M10.956 1.27994L6.06418 14.7201L5 14.7201L9.89181 1.27994L10.956 1.27994Z" fill="currentcolor" />
      </svg>
    </span>
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
