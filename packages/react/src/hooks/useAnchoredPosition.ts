import React from 'react'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorPosition, PositionSettings} from '@primer/behaviors'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

// Check for ResizeObserver support (not available in older browsers or some test environments)
const hasResizeObserver = typeof ResizeObserver !== 'undefined'

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
 *
 * @param settings Settings for calculating the anchored position.
 * @param _dependencies @deprecated Ignored. Position updates are handled automatically
 *   via ResizeObserver and window resize events.
 * @returns An object of {floatingElementRef, anchorElementRef, position} to
 *   absolutely-position the floating element.
 */
export function useAnchoredPosition(
  settings?: AnchoredPositionHookSettings,
  _dependencies?: React.DependencyList,
): {
  floatingElementRef: React.RefObject<Element | null>
  anchorElementRef: React.RefObject<Element | null>
  position: AnchorPosition | undefined
} {
  const floatingElementRef = useProvidedRefOrCreate(settings?.floatingElementRef)
  const anchorElementRef = useProvidedRefOrCreate(settings?.anchorElementRef)

  // Mirror ref values to state so we can use them as effect dependencies.
  // This handles late-mounting elements - when ref.current changes, we sync
  // to state which triggers effects to re-run. We check on every render because
  // refs can change at any time (e.g., conditional rendering) and we need to
  // detect those changes. The setState calls are guarded to only fire when
  // the value actually changes, preventing unnecessary re-renders.
  const [floatingEl, setFloatingEl] = React.useState<Element | null>(null)
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null)
  const [position, setPosition] = React.useState<AnchorPosition | undefined>(undefined)

  // Mutable state that doesn't need to trigger re-renders.
  // State machine for update coalescing:
  // - isPending: true when a rAF is scheduled, prevents duplicate rAF calls
  // - When rAF fires, calculatePosition runs and sets isPending = false
  // - If calculatePosition early-returns (missing elements), isPending is still reset
  //   to allow future updates when elements become available
  const stateRef = React.useRef({
    prevPosition: undefined as AnchorPosition | undefined,
    prevHeight: undefined as number | undefined,
    isPending: false,
  })
  const rafIdRef = React.useRef<number | null>(null)

  // Keep settings in a ref to avoid recalculating position when only callbacks change.
  // Note: When onPositionChange changes, the new callback will be used for subsequent
  // position changes but won't be immediately invoked with the current position.
  const settingsRef = React.useRef(settings)
  useLayoutEffect(() => {
    settingsRef.current = settings
  })

  // Sync refs to state on every render. The setState calls are guarded to only
  // trigger re-renders when the ref values actually change.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally runs every render to detect ref changes
  useLayoutEffect(() => {
    const floatingCurrent = floatingElementRef.current
    const anchorCurrent = anchorElementRef.current
    if (floatingCurrent !== floatingEl) setFloatingEl(floatingCurrent)
    if (anchorCurrent !== anchorEl) setAnchorEl(anchorCurrent)
  })

  // Calculate position - reads from refs for DOM operations, state is only for triggering.
  // This function is idempotent and safe to call multiple times.
  const calculatePosition = React.useCallback(() => {
    const state = stateRef.current
    state.isPending = false
    rafIdRef.current = null

    // Read from refs for actual DOM operations
    const floating = floatingElementRef.current as HTMLElement | null
    const anchor = anchorElementRef.current

    if (!floating || !anchor) {
      if (state.prevPosition !== undefined) {
        state.prevPosition = undefined
        state.prevHeight = undefined
        setPosition(undefined)
        settingsRef.current?.onPositionChange?.(undefined)
      }
      return
    }

    // Batch all DOM reads before any writes to prevent layout thrashing
    const currentHeight = floating.clientHeight
    const anchorTop = anchor.getBoundingClientRect().top
    const newPosition = getAnchoredPosition(floating, anchor, settingsRef.current)

    const {prevPosition, prevHeight} = state
    const currentSettings = settingsRef.current

    // Pin logic: prevent visual jumping when anchored to top and element is shrinking
    if (
      currentSettings?.pinPosition &&
      prevPosition &&
      ['outside-top', 'inside-top'].includes(prevPosition.anchorSide) &&
      (prevPosition.anchorSide !== newPosition.anchorSide || prevPosition.top < newPosition.top) &&
      anchorTop > currentHeight &&
      prevHeight &&
      prevHeight > currentHeight
    ) {
      // Pin the element's height to prevent shrinking, then update prevHeight
      // to reflect the pinned height for subsequent calculations
      floating.style.height = `${prevHeight}px`
      state.prevHeight = prevHeight // Keep the pinned height
      return
    }

    state.prevHeight = currentHeight

    // Only update state if position actually changed to avoid unnecessary re-renders
    if (
      !prevPosition ||
      prevPosition.top !== newPosition.top ||
      prevPosition.left !== newPosition.left ||
      prevPosition.anchorSide !== newPosition.anchorSide ||
      prevPosition.anchorAlign !== newPosition.anchorAlign
    ) {
      state.prevPosition = newPosition
      setPosition(newPosition)
      settingsRef.current?.onPositionChange?.(newPosition)
    }
  }, [floatingElementRef, anchorElementRef])

  // Coalesce multiple update triggers into a single rAF to prevent layout thrashing.
  // Multiple resize events or rapid changes will only result in one position calculation.
  const scheduleUpdate = React.useCallback(() => {
    if (!stateRef.current.isPending) {
      stateRef.current.isPending = true
      rafIdRef.current = requestAnimationFrame(calculatePosition)
    }
  }, [calculatePosition])

  // Calculate position synchronously when elements change (for first paint)
  // floatingEl/anchorEl state triggers this effect, but we read from refs inside
  useLayoutEffect(() => {
    calculatePosition()
  }, [calculatePosition, floatingEl, anchorEl])

  // Watch for element resizes. Only set up observer when both elements are present,
  // since position calculation requires both. Falls back to window resize events
  // in environments where ResizeObserver is not available.
  useLayoutEffect(() => {
    if (!floatingEl || !anchorEl) return
    if (!hasResizeObserver) return // Fall back to window resize only

    const observer = new ResizeObserver(scheduleUpdate)

    observer.observe(floatingEl)
    observer.observe(anchorEl)

    return () => observer.disconnect()
  }, [floatingEl, anchorEl, scheduleUpdate])

  // Watch for window resizes. This also serves as a fallback for environments
  // without ResizeObserver support.
  React.useEffect(() => {
    // eslint-disable-next-line github/prefer-observers
    window.addEventListener('resize', scheduleUpdate)
    return () => window.removeEventListener('resize', scheduleUpdate)
  }, [scheduleUpdate])

  // Cancel pending rAF on unmount
  React.useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return {floatingElementRef, anchorElementRef, position}
}
