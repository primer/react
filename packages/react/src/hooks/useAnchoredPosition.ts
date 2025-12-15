import React from 'react'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorPosition, PositionSettings} from '@primer/behaviors'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

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

  // Store updatePosition in a ref to avoid re-subscribing listeners when dependencies change.
  // The ref always has the latest function, so listeners don't need updatePosition in their deps.
  const updatePositionRef = React.useRef(updatePosition)
  useLayoutEffect(() => {
    updatePositionRef.current = updatePosition
  })

  useLayoutEffect(() => {
    savedOnPositionChange.current = settings?.onPositionChange
  }, [settings?.onPositionChange])

  // Recalculate position when dependencies change
  useLayoutEffect(updatePosition, [updatePosition])

  // Window resize listener for viewport changes.
  // Uses updatePositionRef to avoid re-subscribing on every dependency change.
  React.useEffect(() => {
    const handleResize = () => updatePositionRef.current()
    // eslint-disable-next-line github/prefer-observers
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Single coalesced ResizeObserver for floating element and anchor element.
  // This reduces layout reads during resize events (better INP) by batching
  // observations into one callback instead of triggering updatePosition 2x.
  // Uses updatePositionRef to avoid re-creating observer on dependency changes.
  useLayoutEffect(() => {
    const floatingEl = floatingElementRef.current
    const anchorEl = anchorElementRef.current

    if (typeof ResizeObserver !== 'function') {
      return
    }

    // First callback must be immediate - ResizeObserver fires synchronously
    // on observe() and positioning must be correct before paint
    let isFirstCallback = true
    let pendingFrame: number | null = null

    const observer = new ResizeObserver(() => {
      if (isFirstCallback) {
        isFirstCallback = false
        updatePositionRef.current()
        return
      }

      // Subsequent callbacks are throttled with rAF for better INP
      if (pendingFrame === null) {
        pendingFrame = requestAnimationFrame(() => {
          pendingFrame = null
          updatePositionRef.current()
        })
      }
    })

    // Observe floating and anchor elements if available
    if (floatingEl instanceof Element) {
      observer.observe(floatingEl)
    }
    if (anchorEl instanceof Element) {
      observer.observe(anchorEl)
    }

    return () => {
      if (pendingFrame !== null) {
        cancelAnimationFrame(pendingFrame)
      }
      observer.disconnect()
    }
  }, [floatingElementRef, anchorElementRef])

  return {
    floatingElementRef,
    anchorElementRef,
    position,
  }
}
