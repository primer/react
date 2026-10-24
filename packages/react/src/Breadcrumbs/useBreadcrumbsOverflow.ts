import {useEffect, useRef, useState} from 'react'

export const NARROW_BREAKPOINT = 544
const ROW_HEIGHT_PROPERTY = '--breadcrumbs-row-min-height'
const MENU_SLOT_WIDTH = 44 // Small IconButton plus its separator

type NarrowHandover = {nav: HTMLElement; list: HTMLElement; widthSentinel: HTMLElement}
let pendingNarrowHandovers: NarrowHandover[] = []

// Content-box width, matching what the pre-hydration container query measures.
function getContentWidth(nav: HTMLElement, widthSentinel: HTMLElement) {
  const {paddingLeft, paddingRight} = getComputedStyle(nav)
  return widthSentinel.getBoundingClientRect().width - parseFloat(paddingLeft) - parseFloat(paddingRight)
}

// Hands the narrow rule over from the container query, whose size containment collapses content-sized
// containers to 0px. Batched across instances so mounting many costs two layouts instead of one each.
function scheduleNarrowHandover(handover: NarrowHandover) {
  if (pendingNarrowHandovers.push(handover) > 1) return
  queueMicrotask(() => {
    const batch = pendingNarrowHandovers
    pendingNarrowHandovers = []
    for (const {nav, list} of batch) {
      list.removeAttribute('data-narrow')
      nav.setAttribute('data-measured', '')
    }
    const widths = batch.map(({nav, widthSentinel}) => getContentWidth(nav, widthSentinel))
    for (const [index, {list}] of batch.entries()) {
      list.toggleAttribute('data-narrow', widths[index] < NARROW_BREAKPOINT)
    }
  })
}

/**
 * Mirrors the CSS-driven layout of the CSS overflow Breadcrumbs: which leading crumbs wrapped out of view, and
 * whether the pinned root moved into the menu. Only those two values are React state (they fill the menu).
 *
 * Everything else is written straight to the DOM so it can't lag behind layout, and must never be rendered by React:
 * list `data-overflowing`, `data-narrow`, `data-root-collapsed`, `data-observed`; nav `data-measured`;
 * row `--breadcrumbs-row-min-height`; crumb `inert`.
 */
export function useBreadcrumbsOverflow(rowKeys: string) {
  const navRef = useRef<HTMLElement>(null)
  const widthSentinelRef = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const rowRef = useRef<HTMLOListElement>(null)
  const rootRef = useRef<HTMLLIElement>(null)
  const rootWidthRef = useRef(0)

  const [clipped, setClipped] = useState({keys: rowKeys, count: 0})
  const [rootCollapsed, setRootCollapsed] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    const widthSentinel = widthSentinelRef.current
    const list = listRef.current
    const row = rowRef.current
    if (
      !nav ||
      !widthSentinel ||
      !list ||
      !row ||
      typeof IntersectionObserver !== 'function' ||
      typeof ResizeObserver !== 'function'
    ) {
      return
    }
    const items = Array.from(row.children) as HTMLElement[]
    const host = row.parentElement as HTMLElement

    const updateNarrow = () =>
      list.toggleAttribute('data-narrow', getContentWidth(nav, widthSentinel) < NARROW_BREAKPOINT)

    // Like the measured implementation, the pinned root moves into the menu rather than squeezing the leaf.
    const updateRootCollapse = () => {
      const root = rootRef.current
      const leaf = items.at(-1)?.firstElementChild
      const collapsed = list.hasAttribute('data-root-collapsed')
      if (!root || !leaf) {
        if (collapsed) {
          list.removeAttribute('data-root-collapsed')
          setRootCollapsed(false)
        }
        return
      }
      const otherOverflow =
        list.hasAttribute('data-has-overflow') ||
        list.hasAttribute('data-overflowing') ||
        (list.hasAttribute('data-narrow') && list.hasAttribute('data-narrow-collapse'))
      const menuCost = otherOverflow ? 0 : MENU_SLOT_WIDTH
      let next = collapsed
      if (!collapsed && leaf.scrollWidth > leaf.clientWidth + 1) {
        rootWidthRef.current = root.offsetWidth
        next = rootWidthRef.current > menuCost
      } else if (collapsed) {
        // Assume the menu stays: restoring the root can wrap other crumbs back into it.
        next = host.offsetWidth - rootWidthRef.current < leaf.scrollWidth
      }
      if (next !== collapsed) {
        list.toggleAttribute('data-root-collapsed', next)
        setRootCollapsed(next)
      }
    }
    // Toggling the root resizes observed crumbs, so changes driven by resizes wait a frame to avoid observer loops.
    let rootCollapseFrame = 0
    const scheduleRootCollapse = () => {
      cancelAnimationFrame(rootCollapseFrame)
      rootCollapseFrame = requestAnimationFrame(updateRootCollapse)
    }

    // The row is clipped to one line of text; grow it to fit taller crumbs on that line (e.g. custom wrappers).
    const updateRowHeight = () => {
      const leaf = items.at(-1)
      if (!leaf) return
      const firstLineBottom = leaf.offsetTop + leaf.offsetHeight
      const height = Math.max(
        0,
        ...items.filter(item => item.offsetTop < firstLineBottom).map(item => item.offsetHeight),
      )
      // Nothing is laid out while hidden (e.g. inside `display: none`); fall back to the CSS height.
      const value = height > 0 ? `${height}px` : ''
      if (row.style.getPropertyValue(ROW_HEIGHT_PROPERTY) !== value) row.style.setProperty(ROW_HEIGHT_PROPERTY, value)
    }

    if (!nav.hasAttribute('data-measured')) scheduleNarrowHandover({nav, list, widthSentinel})

    const clippedItems = new Set<Element>()
    const intersectionObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.intersectionRatio < 0.95) clippedItems.add(entry.target)
          else clippedItems.delete(entry.target)
        }
        // Items wrap from the start, so count the clipped prefix. The leaf never collapses.
        const leading = items.slice(0, -1)
        const firstUnclipped = leading.findIndex(item => !clippedItems.has(item))
        const count = firstUnclipped === -1 ? leading.length : firstUnclipped
        for (const [index, item] of items.entries()) {
          if (item.inert !== index < count) item.inert = index < count
        }
        list.toggleAttribute('data-overflowing', count > 0)
        // Hands overflow detection over from the CSS scroll timeline only once `data-overflowing` is known.
        if (!list.hasAttribute('data-observed')) list.setAttribute('data-observed', '')
        updateRowHeight()
        updateRootCollapse()
        setClipped(prev => ((prev.keys === rowKeys ? prev.count : 0) === count ? prev : {keys: rowKeys, count}))
      },
      {root: row, threshold: [0, 0.95]},
    )
    // Only the crumbs and a zero-height width sentinel are watched, so the writes above (which can change
    // the nav's height) never re-trigger this observer within a frame.
    const resizeObserver = new ResizeObserver(entries => {
      if (entries.some(entry => entry.target === widthSentinel)) updateNarrow()
      if (entries.some(entry => entry.target !== widthSentinel)) updateRowHeight()
      scheduleRootCollapse()
    })
    resizeObserver.observe(widthSentinel)
    for (const item of items) {
      intersectionObserver.observe(item)
      resizeObserver.observe(item)
    }
    return () => {
      cancelAnimationFrame(rootCollapseFrame)
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
    }
  }, [rowKeys])

  return {
    navRef,
    widthSentinelRef,
    listRef,
    rowRef,
    rootRef,
    // Ignore a count observed for a different set of items until the observer reports again.
    clippedCount: clipped.keys === rowKeys ? clipped.count : 0,
    rootCollapsed,
  }
}
