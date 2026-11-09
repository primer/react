import React from 'react'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorPosition, PositionSettings} from '@primer/behaviors'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'
import {useResizeObserver} from './useResizeObserver'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

/**
 * Returns all scrollable ancestor elements of the given element, plus the window.
 * An element is scrollable if its computed overflow/overflow-x/overflow-y is
 * 'auto', 'scroll', or 'overlay'.
 */
function getScrollableAncestors(element: Element): Array<Element | Window> {
  const scrollables: Array<Element | Window> = []
  let current = element.parentElement
  while (current) {
    const style = getComputedStyle(current)
    const overflowY = style.overflowY
    const overflowX = style.overflowX
    if (/auto|scroll|overlay/.test(overflowY) || /auto|scroll|overlay/.test(overflowX)) {
      scrollables.push(current)
    }
    current = current.parentElement
  }
  scrollables.push(window)
  return scrollables
}

export interface AnchoredPositionHookSettings extends Partial<PositionSettings> {
  floatingElementRef?: React.RefObject<Element | null>
  anchorElementRef?: React.RefObject<Element | null>
  pinPosition?: boolean
  onPositionChange?: (position: AnchorPosition | undefined) => void
  enabled?: boolean
}

/**
 * Calculates the top and left values for an absolutely-positioned floating element
 * to be anchored to some anchor element. Returns refs for the floating element
 * and the anchor element, along with the position.
 * @param settings Settings for calculating the anchored position.
 * @param dependencies Dependencies to determine when to re-calculate the position.
 * @returns An object of {top: number, left: number} to absolutely-position the
 * floating element.
 */
export function useAnchoredPosition(
  settings?: AnchoredPositionHookSettings,
  dependencies: React.DependencyList = [],
): {
  floatingElementRef: React.RefObject<Element | null>
  anchorElementRef: React.RefObject<Element | null>
  position: AnchorPosition | undefined
} {
  const floatingElementRef = useProvidedRefOrCreate(settings?.floatingElementRef)
  const anchorElementRef = useProvidedRefOrCreate(settings?.anchorElementRef)
  const enabled = settings?.enabled ?? true
  const savedOnPositionChange = React.useRef(settings?.onPositionChange)
  const [position, setPosition] = React.useState<AnchorPosition | undefined>(undefined)
  const prevHeightRef = React.useRef<number | undefined>(undefined)

  const topPositionChanged = (prevPosition: AnchorPosition | undefined, newPosition: AnchorPosition) => {
    return (
      prevPosition &&
      ['outside-top', 'inside-top'].includes(prevPosition.anchorSide) &&
      // either the anchor changed or the element is trying to shrink in height
      (prevPosition.anchorSide !== newPosition.anchorSide || prevPosition.top < newPosition.top)
    )
  }

  const updateElementHeight = (prevHeight: number | undefined) => {
    // if the element is trying to shrink in height, restore to old height to prevent it from jumping
    if (prevHeight && prevHeight > (floatingElementRef.current?.clientHeight ?? 0)) {
      requestAnimationFrame(() => {
        ;(floatingElementRef.current as HTMLElement).style.height = `${prevHeight}px`
      })
      return true
    }
    return false
  }

  const updatePosition = React.useCallback(
    () => {
      if (!enabled) return
      // Captured before the ref is updated below: state updaters can run later, during render.
      const prevHeight = prevHeightRef.current
      if (floatingElementRef.current instanceof Element && anchorElementRef.current instanceof Element) {
        const newPosition = getAnchoredPosition(floatingElementRef.current, anchorElementRef.current, settings)
        setPosition(prev => {
          if (settings?.pinPosition && topPositionChanged(prev, newPosition)) {
            const anchorTop = anchorElementRef.current?.getBoundingClientRect().top ?? 0
            const elementStillFitsOnTop = anchorTop > (floatingElementRef.current?.clientHeight ?? 0)

            if (elementStillFitsOnTop && updateElementHeight(prevHeight)) {
              return prev
            }
          }

          if (prev && prev.anchorSide === newPosition.anchorSide) {
            savedOnPositionChange.current?.(newPosition)
          }

          // Returning the previous object lets React bail out of re-rendering.
          if (
            prev &&
            prev.top === newPosition.top &&
            prev.left === newPosition.left &&
            prev.anchorSide === newPosition.anchorSide &&
            prev.anchorAlign === newPosition.anchorAlign
          ) {
            return prev
          }

          return newPosition
        })
      } else {
        setPosition(undefined)
        savedOnPositionChange.current?.(undefined)
      }
      prevHeightRef.current = floatingElementRef.current?.clientHeight
    },
    // The primitive settings are listed instead of `settings` because callers pass inline objects.
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
    [
      floatingElementRef,
      anchorElementRef,
      enabled,
      settings?.side,
      settings?.align,
      settings?.anchorOffset,
      settings?.alignmentOffset,
      settings?.allowOutOfBounds,
      settings?.displayInViewport,
      settings?.pinPosition,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...dependencies,
    ],
  )

  useLayoutEffect(() => {
    savedOnPositionChange.current = settings?.onPositionChange
  }, [settings?.onPositionChange])

  // Defer the first updatePosition to useEffect when the overlay is closed on
  // mount, avoiding paint-blocking cascading setState. If the overlay is already
  // open on mount, run synchronously in useLayoutEffect to prevent a flash.
  // After mount (including Suspense reappear), only call updatePosition when
  // both refs are attached — skipping closed overlays avoids unnecessary setState.
  const hasMountedRef = React.useRef(false)
  useLayoutEffect(() => {
    if (floatingElementRef.current instanceof Element && anchorElementRef.current instanceof Element) {
      hasMountedRef.current = true
      updatePosition()
    }
  }, [updatePosition, floatingElementRef, anchorElementRef])

  React.useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      updatePosition()
    }
  }, [updatePosition])

  // Watches the document element, so content above the anchor that shifts it is picked up even though no scroll event fires.
  useResizeObserver(updatePosition, undefined, [], enabled)

  // The document element only resizes with the viewport height when the page is as tall as the viewport,
  // so listen for window resizes to reposition on viewport changes.
  React.useEffect(() => {
    if (!enabled) return
    // eslint-disable-next-line github/prefer-observers -- the document element observer does not fire for every viewport size change
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [enabled, updatePosition])

  useResizeObserver(updatePosition, floatingElementRef as React.RefObject<HTMLElement | null>, [], enabled) // watches for changes in floating element size

  // Caches the scrollable-ancestor walk (which calls getComputedStyle on every
  // ancestor) keyed by the anchor element, so the scroll-listener effect below can
  // re-run on `updatePosition`/`enabled` changes without repeating the DOM walk when
  // the anchor is unchanged (the common case). This assumes the anchor is not
  // re-parented while it stays mounted — anchored overlays keep a stable anchor for
  // their lifetime, so a moved-but-same-identity anchor is not a supported case.
  const scrollAncestorsCacheRef = React.useRef<{anchor: Element | null; scrollables: Array<Element | Window>}>({
    anchor: null,
    scrollables: [],
  })

  // Recalculate position when any scrollable ancestor of the anchor scrolls.
  // Uses requestAnimationFrame to avoid layout thrashing during scroll.
  React.useEffect(() => {
    if (!enabled) return
    const anchorEl = anchorElementRef.current
    if (!anchorEl) return

    let rafId: number | null = null
    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        updatePosition()
      })
    }

    // The set of scrollable ancestors depends on the anchor element and its
    // position in the DOM tree. Anchored overlays keep a stable, non-re-parented
    // anchor while mounted, so keying the cache on anchor identity lets us reuse
    // the walk when the anchor hasn't changed instead of re-running
    // getComputedStyle up the whole ancestor chain on every effect re-run.
    const cache = scrollAncestorsCacheRef.current
    let scrollables: Array<Element | Window>
    if (cache.anchor === anchorEl) {
      scrollables = cache.scrollables
    } else {
      scrollables = getScrollableAncestors(anchorEl)
      scrollAncestorsCacheRef.current = {anchor: anchorEl, scrollables}
    }
    for (const scrollable of scrollables) {
      // eslint-disable-next-line github/prefer-observers -- IntersectionObserver cannot detect continuous scroll position changes needed for repositioning
      scrollable.addEventListener('scroll', handleScroll)
    }

    return () => {
      for (const scrollable of scrollables) {
        scrollable.removeEventListener('scroll', handleScroll)
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [anchorElementRef, updatePosition, enabled])

  return {
    floatingElementRef,
    anchorElementRef,
    position,
  }
}
