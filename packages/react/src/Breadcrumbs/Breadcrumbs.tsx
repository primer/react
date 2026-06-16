import {clsx} from 'clsx'
import type {To} from 'history'
import React, {useState, useRef, useCallback, useMemo, type ForwardedRef} from 'react'
import classes from './Breadcrumbs.module.css'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import Details from '../Details'
import {ActionList} from '../ActionList'
import {IconButton} from '../Button/IconButton'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {useResizeObserver} from '../hooks/useResizeObserver'
import type {ResizeObserverEntry} from '../hooks/useResizeObserver'
import {useOnEscapePress} from '../hooks/useOnEscapePress'
import {useOnOutsideClick} from '../hooks/useOnOutsideClick'
import {type PolymorphicProps, fixedForwardRef} from '../utils/modern-polymorphic'

export type BreadcrumbsProps = React.PropsWithChildren<{
  /**
   * Optional class name for the breadcrumbs container.
   */
  className?: string
  /**
   * Controls the overflow behavior of the breadcrumbs.
   * By default all overflowing crumbs will "wrap" in the given space taking up extra height.
   * In the "menu" option we'll see the overflowing crumbs as part of a menu like dropdown instead of the root breadcrumb.
   * In "menu-with-root" we see that instead of the root, the menu button will take the place of the next breadcrumb.
   */
  overflow?: 'wrap' | 'menu' | 'menu-with-root'
  /**
   * Controls the visual variant of the breadcrumbs.
   * By default, the breadcrumbs will have a normal appearance.
   * In the "spacious" option, the breadcrumbs will have increased padding and a more relaxed layout.
   */
  variant?: 'normal' | 'spacious'
  /**
   * Allows passing of CSS custom properties to the breadcrumbs container.
   */
  style?: React.CSSProperties
}>

const BreadcrumbsList = ({children}: React.PropsWithChildren) => {
  return <ol className={classes.BreadcrumbsList}>{children}</ol>
}

type BreadcrumbsMenuItemProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: React.ReactElement<any>[]
  'aria-label'?: string
}

const BreadcrumbsMenuItem = React.forwardRef<HTMLDetailsElement, BreadcrumbsMenuItemProps>(
  ({items, 'aria-label': ariaLabel, ...rest}, menuRefCallback) => {
    const [isOpen, setIsOpen] = useState(false)
    const detailsRef = useRef<HTMLDetailsElement | null>(null)
    const menuButtonRef = useRef<HTMLButtonElement | null>(null)
    const menuContainerRef = useRef<HTMLDivElement>(null)
    const detailsRefCallback = useCallback(
      (element: HTMLDetailsElement | null) => {
        detailsRef.current = element
        if (typeof menuRefCallback === 'function') {
          menuRefCallback(element)
        }
      },
      [menuRefCallback],
    )
    const handleSummaryClick = useCallback((event: React.MouseEvent) => {
      // Prevent the button click from bubbling up and interfering with details toggle
      event.preventDefault()
      // Manually toggle the details element
      if (detailsRef.current) {
        const newOpenState = !detailsRef.current.open
        detailsRef.current.open = newOpenState
        setIsOpen(newOpenState)
      }
    }, [])

    const closeOverlay = useCallback(() => {
      if (detailsRef.current) {
        detailsRef.current.open = false
        setIsOpen(false)
      }
    }, [])

    const focusOnMenuButton = useCallback(() => {
      menuButtonRef.current?.focus()
    }, [])

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
      ignoreClickRefs: [menuButtonRef],
    })

    return (
      <Details ref={detailsRefCallback} className={classes.MenuDetails} data-component="Breadcrumbs.MenuItem">
        <IconButton
          as="summary"
          role="button"
          ref={menuButtonRef}
          aria-label={ariaLabel || `${items.length} more breadcrumb items`}
          aria-expanded={isOpen ? 'true' : 'false'}
          onClick={handleSummaryClick}
          variant="invisible"
          size="small"
          icon={KebabHorizontalIcon}
          tooltipDirection="e"
          {...rest}
        />
        <div ref={menuContainerRef} className={classes.MenuOverlay}>
          <ActionList>
            {items.map((item, index) => {
              const {children, selected, as: Component, ...itemProps} = item.props
              return (
                <ActionList.LinkItem
                  key={index}
                  as={Component}
                  {...itemProps}
                  aria-current={selected ? 'page' : undefined}
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement<any>[]
}

const MENU_BUTTON_FALLBACK_WIDTH = 32 // Design system small IconButton
const CONTAINER_FALLBACK_WIDTH = 800 // Used before the container has been measured

type OverflowResult = {
  /** Number of leading items collapsed into the overflow menu. */
  menuItemCount: number
  effectiveHideRoot: boolean
}

// Pure derivation of how many leading breadcrumb items collapse into the
// overflow menu, given the measured widths. Returns counts/flags (primitives)
// rather than element arrays so the render memo below only invalidates when the
// split actually changes, not on every sub-threshold resize. Kept outside the
// overflow menu, given the measured widths. Kept outside the component so it has no
// hidden dependency on previous state and can be called directly during render.
function calculateOverflow({
  availableWidth,
  itemCount,
  childArrayWidths,
  menuButtonWidth,
  overflow,
  hideRoot,
}: {
  availableWidth: number
  itemCount: number
  childArrayWidths: number[]
  menuButtonWidth: number
  overflow: NonNullable<BreadcrumbsProps['overflow']>
  hideRoot: boolean
}): OverflowResult {
  let eHideRoot = hideRoot
  const rootItemWidth = childArrayWidths[0] ?? 0
  const NARROW_BREAKPOINT = 544
  const isNarrow = availableWidth < NARROW_BREAKPOINT

  let MIN_VISIBLE_ITEMS = 4
  if (!eHideRoot) {
    MIN_VISIBLE_ITEMS = 3
  } else if (isNarrow && itemCount > 2) {
    MIN_VISIBLE_ITEMS = 1
  }

  const calculateVisibleItemsWidth = (w: number[]) => {
    const widths = w.reduce((sum, width) => sum + width + 16, 0)
    return !eHideRoot ? rootItemWidth + widths : widths
  }

  let currentVisibleItemWidths = [...childArrayWidths]
  let menuItemCount = 0

  if (availableWidth > 0 && currentVisibleItemWidths.length > 0) {
    let visibleItemsWidthTotal = calculateVisibleItemsWidth(currentVisibleItemWidths)

    if (menuItemCount > 0) {
      visibleItemsWidthTotal += menuButtonWidth
    }
    while (
      (overflow === 'menu' || overflow === 'menu-with-root') &&
      (visibleItemsWidthTotal > availableWidth || currentVisibleItemWidths.length > MIN_VISIBLE_ITEMS)
    ) {
      menuItemCount += 1
      currentVisibleItemWidths = currentVisibleItemWidths.slice(1)

      visibleItemsWidthTotal = calculateVisibleItemsWidth(currentVisibleItemWidths)

      if (menuItemCount > 0) {
        visibleItemsWidthTotal += menuButtonWidth
      }

      if (currentVisibleItemWidths.length === 1 && visibleItemsWidthTotal > availableWidth) {
        eHideRoot = true
        break
      } else {
        eHideRoot = hideRoot
      }
    }
  }
  return {menuItemCount, effectiveHideRoot: eHideRoot}
}

function Breadcrumbs({className, children, style, overflow = 'wrap', variant = 'normal'}: BreadcrumbsProps) {
  const containerRef = useRef<HTMLElement>(null)

  const hideRoot = !(overflow === 'menu-with-root')
  const childArray = useMemo(() => getValidChildren(children), [children])
  const rootItem = childArray[0]

  // Measured values. Everything else (which items are visible, which are collapsed
  // into the overflow menu, and whether the root is hidden) is derived from these
  // during render rather than synced into state with effects.
  const [childArrayWidths, setChildArrayWidths] = useState<number[]>(() => [])
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const [menuButtonWidth, setMenuButtonWidth] = useState(MENU_BUTTON_FALLBACK_WIDTH)

  const measureMenuButton = useCallback((element: HTMLDetailsElement | null) => {
    if (element) {
      const iconButtonElement = element.querySelector('button[data-component="IconButton"]')
      if (iconButtonElement) {
        const measuredWidth = (iconButtonElement as HTMLElement).offsetWidth
        setMenuButtonWidth(prev => (prev === measuredWidth ? prev : measuredWidth))
      }
    }
  }, [])

  // Measure the container and every breadcrumb item. Only the menu overflow modes
  // need measurement; `wrap` is laid out entirely by CSS, so we skip the work (and
  // the extra pre-paint render) there. Item widths can only be measured while all
  // items are rendered (before any move into the overflow menu), so the derivation
  // below renders all items until these measurements exist.
  useIsomorphicLayoutEffect(() => {
    if (overflow === 'wrap') return
    const containerElement = containerRef.current
    if (!containerElement) return
    const measuredContainerWidth = containerElement.offsetWidth
    setContainerWidth(prev => (prev === measuredContainerWidth ? prev : measuredContainerWidth))
    const listElement = containerElement.querySelector('ol')
    if (listElement && listElement.children.length > 0 && listElement.children.length === childArray.length) {
      const widths = Array.from(listElement.children).map(child => (child as HTMLElement).offsetWidth)
      setChildArrayWidths(widths)
    }
  }, [childArray, overflow])

  // `wrap` mode never reads the container width, so don't observe it there.
  useResizeObserver(
    (entries: ResizeObserverEntry[]) => {
      if (entries[0]) {
        const width = entries[0].contentRect.width
        setContainerWidth(prev => (prev === width ? prev : width))
      }
    },
    containerRef,
    [],
    overflow !== 'wrap',
  )

  // Derive how many leading items collapse into the overflow menu. This runs during
  // render and returns primitives, so `finalChildren` below is only rebuilt when the
  // split actually changes — not on every sub-threshold resize. Until item widths
  // have been measured we collapse nothing so the layout effect above can measure
  // every item.
  const {menuItemCount, effectiveHideRoot} = useMemo<OverflowResult>(() => {
    if (overflow === 'wrap' || childArrayWidths.length !== childArray.length) {
      return {menuItemCount: 0, effectiveHideRoot: hideRoot}
    }
    return calculateOverflow({
      availableWidth: containerWidth ?? CONTAINER_FALLBACK_WIDTH,
      itemCount: childArray.length,
      childArrayWidths,
      menuButtonWidth,
      overflow,
      hideRoot,
    })
  }, [overflow, hideRoot, childArray, childArrayWidths, containerWidth, menuButtonWidth])

  const finalChildren = React.useMemo(() => {
    if (overflow === 'wrap' || menuItemCount === 0) {
      return React.Children.map(children, child => <li className={classes.ItemWrapper}>{child}</li>)
    }

    const menuItems = childArray.slice(0, menuItemCount)
    const visibleItems = childArray.slice(menuItemCount)

    // In 'menu-with-root' mode the root stays visible, so drop it from the menu.
    const effectiveMenuItems = effectiveHideRoot ? menuItems : menuItems.slice(1)
    const menuElement = (
      <li className={classes.BreadcrumbsItem} key="breadcrumbs-menu">
        <BreadcrumbsMenuItem
          ref={measureMenuButton}
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

    if (effectiveHideRoot) {
      // Show: [overflow menu, leaf breadcrumb]
      return [menuElement, ...visibleElements]
    } else {
      // Show: [root breadcrumb, overflow menu, leaf breadcrumb]
      return [rootElement, menuElement, ...visibleElements]
    }
  }, [overflow, menuItemCount, effectiveHideRoot, measureMenuButton, childArray, rootItem, children])

  return (
    <nav
      className={clsx(className, classes.BreadcrumbsBase)}
      aria-label="Breadcrumbs"
      style={style}
      ref={containerRef}
      data-overflow={overflow}
      data-variant={variant}
      data-component="Breadcrumbs"
    >
      <BreadcrumbsList>{finalChildren}</BreadcrumbsList>
    </nav>
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

type StyledBreadcrumbsItemProps<As extends React.ElementType = 'a'> = PolymorphicProps<
  As,
  'a',
  {
    to?: To
    selected?: boolean
  }
>

const BreadcrumbsItem = fixedForwardRef(
  <As extends React.ElementType = 'a'>(
    props: StyledBreadcrumbsItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: ForwardedRef<any>,
  ) => {
    const {as: Component = 'a', selected, className, ...rest} = props
    return (
      <Component
        className={clsx(className, classes.Item, selected && 'selected')}
        aria-current={selected ? 'page' : undefined}
        ref={ref}
        data-component="Breadcrumbs.Item"
        {...rest}
      />
    )
  },
)

Breadcrumbs.displayName = 'Breadcrumbs'

export type BreadcrumbsItemProps<As extends React.ElementType = 'a'> = StyledBreadcrumbsItemProps<As>

const BreadcrumbsItemWithDisplayName = Object.assign(BreadcrumbsItem, {displayName: 'Breadcrumbs.Item'})
export default Object.assign(Breadcrumbs, {Item: BreadcrumbsItemWithDisplayName})

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
export type BreadcrumbItemProps<As extends React.ElementType = 'a'> = BreadcrumbsItemProps<As>
