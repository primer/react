import {clsx} from 'clsx'
import type {To} from 'history'
import React, {useState, useRef, useCallback, useMemo, type ForwardedRef} from 'react'
import classes from './Breadcrumbs.module.css'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {ActionList} from '../ActionList'
import {IconButton} from '../Button/IconButton'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {useResizeObserver} from '../hooks/useResizeObserver'
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

const MENU_BUTTON_WIDTH = 32 // small IconButton
// Width of the chevron icon drawn between collapsed-style crumbs. Also the starting guess for
// the plain separator until one has been measured.
const SEPARATOR_ICON_WIDTH = 16
const NARROW_WIDTH = 544

/**
 * Collapse state that depends on layout. `extra` is the number of crumbs collapsed beyond
 * the count rule, so adding or removing crumbs in a wide container never changes state.
 */
type Fit = {extra: number; rootCollapsed: boolean; narrow: boolean}

const INITIAL_FIT: Fit = {extra: 0, rootCollapsed: false, narrow: false}

function minVisible(withRoot: boolean, narrow: boolean, itemCount: number) {
  if (withRoot) return 3
  return narrow && itemCount > 2 ? 1 : 4
}

// Leading crumbs that collapse by count alone. Needs no measurement, so it is applied
// during render (including on the server).
function countRule(withRoot: boolean, narrow: boolean, itemCount: number) {
  return Math.max(0, itemCount - minVisible(withRoot, narrow, itemCount))
}

/**
 * Separator width after a crumb, per rendering. The plain one is drawn in `em`, so it follows the
 * text size; the collapsed one is the fixed-size icon.
 */
type Separators = {plain: number; collapsed: number}

const INITIAL_SEPARATORS: Separators = {plain: SEPARATOR_ICON_WIDTH, collapsed: SEPARATOR_ICON_WIDTH}

function computeFit(widths: number[], separators: Separators, available: number, withRoot: boolean): Fit {
  const itemCount = widths.length
  if (available <= 0 || itemCount === 0) return INITIAL_FIT
  const narrow = available < NARROW_WIDTH
  const min = minVisible(withRoot, narrow, itemCount)
  const rootWidth = withRoot ? widths[0] + separators.collapsed : 0
  // Collapsing the first `collapsed` crumbs. Mirrors the rendering: with nothing in the menu every
  // crumb is shown with the plain separator (the last has none). Otherwise the visible crumbs
  // each count a collapsed separator, the last one's standing in for the menu item's own.
  const menuCount = (collapsed: number) => Math.max(0, collapsed - (withRoot ? 1 : 0))
  let tailWidth = widths.reduce((sum, width) => sum + width + separators.collapsed, 0)
  const total = widths.reduce((sum, width) => sum + width, 0)
  const width = (collapsed: number) =>
    menuCount(collapsed) === 0 ? total + separators.plain * (itemCount - 1) : rootWidth + tailWidth + MENU_BUTTON_WIDTH
  let collapsed = 0
  let rootCollapsed = false
  while (width(collapsed) > available || itemCount - collapsed > min) {
    tailWidth -= widths[collapsed] + separators.collapsed
    collapsed += 1
    if (itemCount - collapsed === 1 && width(collapsed) > available) {
      rootCollapsed = withRoot
      break
    }
  }
  return {extra: collapsed - countRule(withRoot, narrow, itemCount), rootCollapsed, narrow}
}

// Content box width: excludes padding, matching what the crumbs can occupy.
function getContentWidth(nav: HTMLElement) {
  const {paddingLeft, paddingRight} = getComputedStyle(nav)
  return nav.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight)
}

const sameFit = (a: Fit, b: Fit) => a.extra === b.extra && a.rootCollapsed === b.rootCollapsed && a.narrow === b.narrow

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CrumbElement = React.ReactElement<any>

function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as CrumbElement[]
}

type OverflowMenuProps = {items: CrumbElement[]}

function OverflowMenu({
  items,
  open,
  setOpen,
}: OverflowMenuProps & {open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [setOpen])
  return (
    <div className={classes.MenuDetails} data-component="Breadcrumbs.MenuItem">
      <IconButton
        ref={buttonRef}
        aria-label={`${items.length} more breadcrumb items`}
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
        variant="invisible"
        size="small"
        icon={KebabHorizontalIcon}
        tooltipDirection="e"
      />
      {open ? <OverflowMenuOverlay items={items} close={close} buttonRef={buttonRef} /> : null}
    </div>
  )
}

// Mounted only while the menu is open, so closed menus register no document listeners
// and render no menu items.
function OverflowMenuOverlay({
  items,
  close,
  buttonRef,
}: OverflowMenuProps & {close: () => void; buttonRef: React.RefObject<HTMLButtonElement | null>}) {
  const containerRef = useRef<HTMLDivElement>(null)
  useOnEscapePress(
    (event: KeyboardEvent) => {
      event.preventDefault()
      close()
      buttonRef.current?.focus()
    },
    [close, buttonRef],
  )
  useOnOutsideClick({onClickOutside: close, containerRef, ignoreClickRefs: [buttonRef]})
  return (
    <div ref={containerRef} className={classes.MenuOverlay}>
      <ActionList>
        {items.map(item => {
          const {children, selected, as: Component, ...itemProps} = item.props
          return (
            <ActionList.LinkItem
              key={item.key}
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
  )
}

function Breadcrumbs({className, children, style, overflow = 'wrap', variant = 'normal'}: BreadcrumbsProps) {
  const navRef = useRef<HTMLElement>(null)
  // Last measured width of each crumb, by key. Crumbs keep their width while they are
  // collapsed, so resizing never needs to render them.
  const widthsRef = useRef(new Map<React.Key, number>())
  const [fit, setFit] = useState<Fit>(INITIAL_FIT)
  // Mirrors `fit` so unchanged results never schedule a render.
  const fitRef = useRef<Fit>(INITIAL_FIT)
  // Last measured separator widths. Like the crumb widths they don't depend on the fit.
  const separatorsRef = useRef(INITIAL_SEPARATORS)
  const [menuOpen, setMenuOpen] = useState(false)

  const collapsible = overflow !== 'wrap'
  const withRoot = overflow === 'menu-with-root'
  const items = useMemo(() => getValidChildren(children), [children])
  const itemCount = items.length

  const updateFit = useCallback(
    (available: number) => {
      const widths = items.map(item => widthsRef.current.get(item.key ?? '') ?? 0)
      const next = computeFit(widths, separatorsRef.current, available, withRoot)
      if (sameFit(fitRef.current, next)) return
      fitRef.current = next
      setFit(next)
    },
    [items, withRoot],
  )

  // Measure the crumbs that are rendered. This only reads layout. Collapsed crumbs that can
  // reappear stay mounted as zero-size items whose grid track is `max-content` (see the CSS), so
  // they measure at their natural width whatever their `min-width` is. The
  // crumb is measured without its separator, and each styling's separator is kept on its own
  // (taken from any rendered crumb that has one), so measurements don't change when the fit does.
  const measure = useCallback(
    (nav: HTMLElement, available: number) => {
      const previous = widthsRef.current
      const widths = new Map<React.Key, number>()
      let separators = separatorsRef.current
      for (const item of items) {
        const width = previous.get(item.key ?? '')
        if (width !== undefined) widths.set(item.key ?? '', width)
      }
      for (const li of nav.querySelectorAll<HTMLElement>(':scope > ol > li[data-index]')) {
        const key = items[Number(li.getAttribute('data-index'))]?.key
        const crumb = li.firstElementChild
        if (key == null || !crumb) continue
        const crumbWidth = crumb.getBoundingClientRect().width
        widths.set(key, crumbWidth)
        if (li.nextElementSibling && !li.hasAttribute('data-collapsed')) {
          const separator = li.getBoundingClientRect().width - crumbWidth
          const kind = li.classList.contains(classes.ItemWrapper) ? 'plain' : 'collapsed'
          if (separators[kind] !== separator) separators = {...separators, [kind]: separator}
        }
      }
      separatorsRef.current = separators
      widthsRef.current = widths
      updateFit(available)
    },
    [items, updateFit],
  )

  // True while the nav had no width (e.g. `display: none`). Its crumbs can't be measured then,
  // so the previous widths and fit are kept and layout is measured again once it is shown.
  const hiddenRef = useRef(false)

  useIsomorphicLayoutEffect(() => {
    const nav = navRef.current
    if (!collapsible || !nav) return
    // Hands layout over from the pre-hydration CSS rules. JS-owned: React never renders it.
    if (!nav.hasAttribute('data-hydrated')) nav.setAttribute('data-hydrated', '')
    const available = getContentWidth(nav)
    hiddenRef.current = available <= 0
    if (!hiddenRef.current) measure(nav, available)
  }, [collapsible, fit, menuOpen, measure])

  // Container resizes reuse the cached widths; React only re-renders when the split changes.
  // The width is read from the element rather than the observer entry because the hook's
  // fallback reports the border box.
  useResizeObserver(
    () => {
      const nav = navRef.current
      if (!nav) return
      const available = getContentWidth(nav)
      if (available <= 0) {
        hiddenRef.current = true
      } else if (hiddenRef.current) {
        hiddenRef.current = false
        measure(nav, available)
      } else {
        updateFit(available)
      }
    },
    navRef,
    [],
    collapsible,
  )

  let content: React.ReactNode
  if (!collapsible) {
    if (menuOpen) setMenuOpen(false)
    content = React.Children.map(children, child => <li className={classes.ItemWrapper}>{child}</li>)
  } else {
    const collapsed = Math.min(Math.max(itemCount - 1, 0), countRule(withRoot, fit.narrow, itemCount) + fit.extra)
    const rootVisible = withRoot && !(collapsed > 0 && fit.rootCollapsed)
    const menuItems = items.slice(rootVisible ? 1 : 0, collapsed)
    if (menuOpen && menuItems.length === 0) setMenuOpen(false)

    // Until something collapses, crumbs use the `wrap` styling. Only the `li` class and the
    // trailing separator change between the two, so crumbs are never remounted.
    const plain = menuItems.length === 0
    // Crumbs below the count rule at full width can never reappear, so they are not rendered.
    const alwaysCollapsed = countRule(withRoot, false, itemCount)
    const listItems: React.ReactNode[] = []
    for (const [index, item] of items.entries()) {
      const isRoot = withRoot && index === 0
      const isCollapsed = index < collapsed && !(isRoot && rootVisible)
      if (isCollapsed && index < alwaysCollapsed && !isRoot) continue
      // While the menu is open it shows the collapsed crumbs, so they are not also rendered here.
      const rendered = !isCollapsed || !menuOpen
      listItems.push(
        <li
          key={item.key}
          className={plain ? classes.ItemWrapper : classes.BreadcrumbsItem}
          data-index={rendered ? index : undefined}
          data-collapsed={isCollapsed ? '' : undefined}
        >
          {rendered ? item : null}
          {plain ? null : <ItemSeparator />}
        </li>,
      )
    }
    // Before hydration, CSS approximates the narrow rule and needs the menu to be present.
    // It stays hidden otherwise.
    const narrowCollapse = !withRoot && itemCount > 2
    if (!plain || narrowCollapse) {
      listItems.splice(
        withRoot && rootVisible ? 1 : 0,
        0,
        <li className={classes.BreadcrumbsItem} data-overflow-menu="" hidden={plain} key="breadcrumbs-menu">
          <OverflowMenu
            items={plain ? items.slice(0, itemCount - 1) : menuItems}
            open={menuOpen}
            setOpen={setMenuOpen}
          />
          <ItemSeparator />
        </li>,
      )
    }
    content = listItems
  }

  return (
    <nav
      className={clsx(className, classes.BreadcrumbsBase)}
      aria-label="Breadcrumbs"
      style={style}
      ref={navRef}
      data-overflow={overflow}
      data-variant={variant}
      data-component="Breadcrumbs"
    >
      <ol
        className={classes.BreadcrumbsList}
        data-narrow-collapse={collapsible && overflow === 'menu' && itemCount > 2 ? '' : undefined}
      >
        {content}
      </ol>
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
