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
import {useFeatureFlag} from '../FeatureFlags'
import {NARROW_BREAKPOINT, useBreadcrumbsOverflow} from './useBreadcrumbsOverflow'

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
  /** Only render the menu's items while it is open. */
  lazy?: boolean
}

// Mounted only while the menu is open so closed menus don't register document listeners.
function BreadcrumbsMenuDismissal({
  onDismiss,
  containerRef,
  buttonRef,
}: {
  onDismiss: () => void
  containerRef: React.RefObject<HTMLDivElement | null>
  buttonRef: React.RefObject<HTMLButtonElement | null>
}) {
  useOnEscapePress(
    (event: KeyboardEvent) => {
      event.preventDefault()
      onDismiss()
      buttonRef.current?.focus()
    },
    [onDismiss, buttonRef],
  )
  useOnOutsideClick({onClickOutside: onDismiss, containerRef, ignoreClickRefs: [buttonRef]})
  return null
}

const BreadcrumbsMenuItem = React.forwardRef<HTMLDetailsElement, BreadcrumbsMenuItemProps>(
  ({items, 'aria-label': ariaLabel, lazy = false, ...rest}, menuRefCallback) => {
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

    return (
      <Details ref={detailsRefCallback} className={classes.MenuDetails} data-component="Breadcrumbs.MenuItem">
        {isOpen ? (
          <BreadcrumbsMenuDismissal
            onDismiss={closeOverlay}
            containerRef={menuContainerRef}
            buttonRef={menuButtonRef}
          />
        ) : null}
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
          {lazy && !isOpen ? null : (
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
          )}
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

// Width budgeted for the overflow menu button in the overflow calculation.
const MENU_BUTTON_WIDTH = 32
const CONTAINER_FALLBACK_WIDTH = 800 // Used before the container has been measured
const EMPTY_WIDTHS: ReadonlyMap<React.Key | null, number> = new Map()

type OverflowResult = {
  /** Number of leading items collapsed into the overflow menu. */
  menuItemCount: number
  effectiveHideRoot: boolean
}

type OverflowState = OverflowResult & {
  /** The item keys and mode this result was computed for. */
  keys: ReadonlyArray<React.Key | null>
  overflow: BreadcrumbsProps['overflow']
}

const INITIAL_OVERFLOW_STATE: OverflowState = {menuItemCount: 0, effectiveHideRoot: true, keys: [], overflow: undefined}

function keysEqual(a: ReadonlyArray<React.Key | null>, b: ReadonlyArray<React.Key | null>) {
  return a.length === b.length && a.every((key, index) => key === b[index])
}

// Pure derivation of how many leading breadcrumb items collapse into the
// overflow menu, given the measured widths. Returns counts/flags (primitives)
// rather than element arrays so the render memo below only invalidates when the
// split actually changes, not on every sub-threshold resize. Kept outside the
// component so it has no hidden dependency on previous state and can be called
// directly during render.
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

    while (
      (overflow === 'menu' || overflow === 'menu-with-root') &&
      (visibleItemsWidthTotal > availableWidth || currentVisibleItemWidths.length > MIN_VISIBLE_ITEMS)
    ) {
      menuItemCount += 1
      currentVisibleItemWidths = currentVisibleItemWidths.slice(1)

      // A menu button is now shown, so its width is always part of the total.
      visibleItemsWidthTotal = calculateVisibleItemsWidth(currentVisibleItemWidths) + menuButtonWidth

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

function Breadcrumbs(props: BreadcrumbsProps) {
  const cssOverflow = useFeatureFlag('primer_react_breadcrumbs_css_overflow')
  const {overflow = 'wrap'} = props
  if (cssOverflow && overflow !== 'wrap') {
    return <CssOverflowBreadcrumbs {...props} overflow={overflow} />
  }
  return <MeasuredOverflowBreadcrumbs {...props} />
}

// Collapses leading items by letting the browser wrap them onto a clipped second row, so the
// first paint (including SSR) is correct without measuring. JS only tracks which items wrapped
// to fill the overflow menu and hide them from assistive technology.
function CssOverflowBreadcrumbs({
  className,
  children,
  style,
  overflow,
  variant = 'normal',
}: BreadcrumbsProps & {overflow: 'menu' | 'menu-with-root'}) {
  const childArray = useMemo(() => getValidChildren(children), [children])
  const pinRoot = overflow === 'menu-with-root' && childArray.length > 1
  const rootItem = pinRoot ? childArray[0] : undefined
  const trailingItems = pinRoot ? childArray.slice(1) : childArray
  // Items beyond the last 4 (or the root plus the last 3) are collapsed at any width, so they only live in the menu.
  const collapsedByCount = Math.max(0, trailingItems.length - (pinRoot ? 3 : 4))
  const rowItems = useMemo(() => trailingItems.slice(collapsedByCount), [trailingItems, collapsedByCount])
  const rowKeys = rowItems.map(item => String(item.key)).join('\u0000')

  const {navRef, widthSentinelRef, listRef, rowRef, rootRef, clippedCount, rootCollapsed} =
    useBreadcrumbsOverflow(rowKeys)
  const trailingMenuItems = trailingItems.slice(0, collapsedByCount + clippedCount)
  const menuItems = rootItem && rootCollapsed ? [rootItem, ...trailingMenuItems] : trailingMenuItems

  return (
    <nav
      className={clsx(className, classes.BreadcrumbsBase)}
      aria-label="Breadcrumbs"
      style={style}
      data-overflow={overflow}
      data-variant={variant}
      data-component="Breadcrumbs"
      data-css-overflow=""
      ref={navRef}
    >
      <span ref={widthSentinelRef} className={classes.CssOverflowWidthSentinel} aria-hidden="true" />
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- an explicit role lets the list own crumbs through the role="none" wrapper */}
      <ol
        role="list"
        ref={listRef}
        className={clsx(classes.BreadcrumbsList, classes.CssOverflowList)}
        data-has-overflow={collapsedByCount > 0 ? '' : undefined}
        data-narrow-collapse={overflow === 'menu' && childArray.length > 2 ? '' : undefined}
      >
        {rootItem ? (
          <li ref={rootRef} className={clsx(classes.BreadcrumbsItem, classes.CssOverflowCrumb)}>
            {rootItem}
            <ItemSeparator />
          </li>
        ) : null}
        <li className={clsx(classes.BreadcrumbsItem, classes.CssOverflowMenu)} data-overflow-menu="">
          <BreadcrumbsMenuItem
            lazy
            items={menuItems}
            aria-label={menuItems.length > 0 ? `${menuItems.length} more breadcrumb items` : 'More breadcrumb items'}
          />
          <ItemSeparator />
        </li>
        {/* The wrapping row needs its own element; `role="none"` keeps every crumb owned by the outer list. */}
        <li role="none" className={classes.CssOverflowHost}>
          <ol role="none" ref={rowRef} className={classes.CssOverflowRow}>
            {rowItems.map((child, index) => (
              // eslint-disable-next-line jsx-a11y/no-redundant-roles -- the parent list has role="none"
              <li
                role="listitem"
                key={child.key}
                className={clsx(classes.BreadcrumbsItem, classes.CssOverflowCrumb, classes.CssOverflowItem)}
                // The leaf is laid out first so leading items are the ones that wrap away.
                style={{order: rowItems.length - 1 - index}}
              >
                {child}
                <ItemSeparator />
              </li>
            ))}
          </ol>
        </li>
      </ol>
    </nav>
  )
}

function MeasuredOverflowBreadcrumbs({
  className,
  children,
  style,
  overflow = 'wrap',
  variant = 'normal',
}: BreadcrumbsProps) {
  const containerRef = useRef<HTMLElement>(null)

  const hideRoot = !(overflow === 'menu-with-root')
  const childArray = useMemo(() => getValidChildren(children), [children])
  const childKeys = useMemo(() => childArray.map(child => child.key), [childArray])
  const rootItem = childArray[0]

  // Measurements live in refs so resizes and re-measures never render on their own;
  // only a change to the overflow split (below) is stored in state.
  const containerWidthRef = useRef<number | null>(null)
  const itemWidthsRef = useRef<ReadonlyMap<React.Key | null, number>>(EMPTY_WIDTHS)
  const [overflowState, setOverflowState] = useState<OverflowState>(INITIAL_OVERFLOW_STATE)

  // A split computed for other items or another mode is stale; render uncollapsed so items can be measured.
  const isCurrentState = (state: OverflowState) => state.overflow === overflow && keysEqual(state.keys, childKeys)
  const menuItemCount = overflow !== 'wrap' && isCurrentState(overflowState) ? overflowState.menuItemCount : 0
  const effectiveHideRoot = overflowState.effectiveHideRoot

  const updateOverflow = () => {
    if (overflow === 'wrap') return
    const widths = childKeys.map(key => itemWidthsRef.current.get(key))
    if (widths.some(width => width === undefined)) return
    const next = calculateOverflow({
      availableWidth: containerWidthRef.current ?? CONTAINER_FALLBACK_WIDTH,
      itemCount: childKeys.length,
      childArrayWidths: widths as number[],
      menuButtonWidth: MENU_BUTTON_WIDTH,
      overflow,
      hideRoot,
    })
    // Compare outside the updater: an updater that returns `prev` still costs a render pass.
    const prevCount = isCurrentState(overflowState) ? overflowState.menuItemCount : 0
    const unchanged =
      prevCount === next.menuItemCount &&
      (next.menuItemCount === 0 || overflowState.effectiveHideRoot === next.effectiveHideRoot)
    if (!unchanged) setOverflowState({...next, keys: childKeys, overflow})
  }

  // Runs after every commit (before paint) so the split is corrected before it is ever shown.
  useIsomorphicLayoutEffect(() => {
    if (overflow === 'wrap') return
    const containerElement = containerRef.current
    if (!containerElement) return
    containerWidthRef.current = containerElement.offsetWidth
    const listElement = containerElement.querySelector('ol')
    // Item widths are only measured in the uncollapsed layout, which renders every item.
    if (menuItemCount === 0 && listElement && listElement.children.length === childKeys.length) {
      itemWidthsRef.current = new Map(
        childKeys.map((key, index) => [key, (listElement.children[index] as HTMLElement).offsetWidth]),
      )
    }
    updateOverflow()
  })

  // `wrap` mode never reads the container width, so don't observe it there.
  useResizeObserver(
    (entries: ResizeObserverEntry[]) => {
      if (entries[0]) {
        // Match the integer `offsetWidth` used by the layout effect above.
        containerWidthRef.current = Math.round(entries[0].contentRect.width)
        updateOverflow()
      }
    },
    containerRef,
    [],
    overflow !== 'wrap',
  )

  const finalChildren = React.useMemo(() => {
    if (overflow === 'wrap') {
      return React.Children.map(children, child => <li className={classes.ItemWrapper}>{child}</li>)
    }

    // Render the same (re-keyed) `childArray` elements in every menu-mode branch so items that stay
    // visible keep their DOM and state when the collapse point moves instead of remounting.
    if (menuItemCount === 0) {
      return childArray.map(child => (
        <li className={classes.ItemWrapper} key={child.key}>
          {child}
        </li>
      ))
    }

    const menuItems = childArray.slice(0, menuItemCount)
    const visibleItems = childArray.slice(menuItemCount)

    // In 'menu-with-root' mode the root stays visible, so drop it from the menu.
    const effectiveMenuItems = effectiveHideRoot ? menuItems : menuItems.slice(1)
    const menuElement = (
      <li className={classes.BreadcrumbsItem} data-overflow-menu="" key="breadcrumbs-menu">
        <BreadcrumbsMenuItem
          items={effectiveMenuItems}
          aria-label={`${effectiveMenuItems.length} more breadcrumb items`}
        />
        <ItemSeparator />
      </li>
    )

    const visibleElements = visibleItems.map(child => (
      <li className={classes.BreadcrumbsItem} key={child.key}>
        {child}
        <ItemSeparator />
      </li>
    ))

    const rootElement = (
      <li className={classes.BreadcrumbsItem} key={rootItem.key}>
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
  }, [overflow, menuItemCount, effectiveHideRoot, childArray, rootItem, children])

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
