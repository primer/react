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
  const savedOnPositionChange = React.useRef(settings?.onPositionChange)
  const [position, setPosition] = React.useState<AnchorPosition | undefined>(undefined)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setPrevHeight] = React.useState<number | undefined>(undefined)

  const topPositionChanged = (prevPosition: AnchorPosition | undefined, newPosition: AnchorPosition) => {
    return (
      prevPosition &&
      ['outside-top', 'inside-top'].includes(prevPosition.anchorSide) &&
      // either the anchor changed or the element is trying to shrink in height
      (prevPosition.anchorSide !== newPosition.anchorSide || prevPosition.top < newPosition.top)
    )
  }

  const updateElementHeight = () => {
    let heightUpdated = false
    setPrevHeight(prevHeight => {
      // if the element is trying to shrink in height, restore to old height to prevent it from jumping
      if (prevHeight && prevHeight > (floatingElementRef.current?.clientHeight ?? 0)) {
        requestAnimationFrame(() => {
          ;(floatingElementRef.current as HTMLElement).style.height = `${prevHeight}px`
        })
        heightUpdated = true
      }
      return prevHeight
    })
    return heightUpdated
  }

  const updatePosition = React.useCallback(
    () => {
      if (floatingElementRef.current instanceof Element && anchorElementRef.current instanceof Element) {
        const newPosition = getAnchoredPosition(floatingElementRef.current, anchorElementRef.current, settings)
        setPosition(prev => {
          if (settings?.pinPosition && topPositionChanged(prev, newPosition)) {
            const anchorTop = anchorElementRef.current?.getBoundingClientRect().top ?? 0
            const elementStillFitsOnTop = anchorTop > (floatingElementRef.current?.clientHeight ?? 0)

            if (elementStillFitsOnTop && updateElementHeight()) {
              return prev
            }
          }

          if (prev && prev.anchorSide === newPosition.anchorSide) {
            // if the position hasn't changed, don't update
            savedOnPositionChange.current?.(newPosition)
          }

          return newPosition
        })
      } else {
        setPosition(undefined)
        savedOnPositionChange.current?.(undefined)
      }
      setPrevHeight(floatingElementRef.current?.clientHeight)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [floatingElementRef, anchorElementRef, ...dependencies],
  )

  useLayoutEffect(() => {
    savedOnPositionChange.current = settings?.onPositionChange
  }, [settings?.onPositionChange])

  useLayoutEffect(updatePosition, [updatePosition])

  useResizeObserver(updatePosition) // watches for changes in window size
  useResizeObserver(updatePosition, floatingElementRef as React.RefObject<HTMLElement | null>) // watches for changes in floating element size

  // Recalculate position when any scrollable ancestor of the anchor scrolls.
  // Uses requestAnimationFrame to avoid layout thrashing during scroll.
  React.useEffect(() => {
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

    const scrollables = getScrollableAncestors(anchorEl)
    for (const scrollable of scrollables) {
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
  }, [anchorElementRef, updatePosition])

  return {
    floatingElementRef,
    anchorElementRef,
    position,
  }
}
