import React from 'react'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorPosition, PositionSettings} from '@primer/behaviors'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'
import {useResizeObserver} from './useResizeObserver'
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
 * @param _dependencies Deprecated - no longer used. Position updates automatically on resize.
 * @returns An object of {top: number, left: number} to absolutely-position the
 * floating element.
 */
export function useAnchoredPosition(
  settings?: AnchoredPositionHookSettings,
  // Legacy parameter kept for backward compatibility - ignored
  // Position now updates automatically via ResizeObserver
  _dependencies?: React.DependencyList,
): {
  floatingElementRef: React.RefObject<Element | null>
  anchorElementRef: React.RefObject<Element | null>
  position: AnchorPosition | undefined
} {
  const floatingElementRef = useProvidedRefOrCreate(settings?.floatingElementRef)
  const anchorElementRef = useProvidedRefOrCreate(settings?.anchorElementRef)
  const [position, setPosition] = React.useState<AnchorPosition | undefined>(undefined)

  // Use refs instead of state for values that don't need to trigger re-renders
  const prevHeightRef = React.useRef<number | undefined>(undefined)
  const settingsRef = React.useRef(settings)

  // Keep settings ref up to date
  useLayoutEffect(() => {
    settingsRef.current = settings
  })

  const topPositionChanged = (prevPosition: AnchorPosition | undefined, newPosition: AnchorPosition) => {
    return (
      prevPosition &&
      ['outside-top', 'inside-top'].includes(prevPosition.anchorSide) &&
      // either the anchor changed or the element is trying to shrink in height
      (prevPosition.anchorSide !== newPosition.anchorSide || prevPosition.top < newPosition.top)
    )
  }

  const updateElementHeight = () => {
    const prevHeight = prevHeightRef.current
    // if the element is trying to shrink in height, restore to old height to prevent it from jumping
    if (prevHeight && prevHeight > (floatingElementRef.current?.clientHeight ?? 0)) {
      ;(floatingElementRef.current as HTMLElement).style.height = `${prevHeight}px`
      return true
    }
    return false
  }

  // Use ref for updatePosition to avoid re-creating on every render
  const updatePositionRef = React.useRef(() => {
    const currentSettings = settingsRef.current
    if (floatingElementRef.current instanceof Element && anchorElementRef.current instanceof Element) {
      const newPosition = getAnchoredPosition(floatingElementRef.current, anchorElementRef.current, currentSettings)
      setPosition(prev => {
        if (currentSettings?.pinPosition && topPositionChanged(prev, newPosition)) {
          const anchorTop = anchorElementRef.current?.getBoundingClientRect().top ?? 0
          const elementStillFitsOnTop = anchorTop > (floatingElementRef.current?.clientHeight ?? 0)

          if (elementStillFitsOnTop && updateElementHeight()) {
            return prev
          }
        }

        if (prev && prev.anchorSide === newPosition.anchorSide) {
          // if the position hasn't changed, don't update
          currentSettings?.onPositionChange?.(newPosition)
        }

        return newPosition
      })
    } else {
      setPosition(undefined)
      settingsRef.current?.onPositionChange?.(undefined)
    }
    prevHeightRef.current = floatingElementRef.current?.clientHeight
  })

  // Initial position calculation
  useLayoutEffect(() => {
    updatePositionRef.current()
  }, [])

  // ResizeObserver is throttled by default (rAF) for better INP
  useResizeObserver(() => updatePositionRef.current()) // watches for changes in window size
  useResizeObserver(() => updatePositionRef.current(), floatingElementRef as React.RefObject<HTMLElement | null>) // watches for changes in floating element size

  return {
    floatingElementRef,
    anchorElementRef,
    position,
  }
}
