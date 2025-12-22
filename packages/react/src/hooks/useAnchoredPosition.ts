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
  // to state which triggers effects to re-run.
  const [floatingEl, setFloatingEl] = React.useState<Element | null>(null)
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null)
  const [position, setPosition] = React.useState<AnchorPosition | undefined>(undefined)

  // Mutable state that doesn't need to trigger re-renders
  const stateRef = React.useRef({
    prevPosition: undefined as AnchorPosition | undefined,
    prevHeight: undefined as number | undefined,
    isPending: false,
  })
  const rafIdRef = React.useRef<number | null>(null)

  // Keep settings in a ref to avoid recalculating position when only callbacks change
  const settingsRef = React.useRef(settings)
  useLayoutEffect(() => {
    settingsRef.current = settings
  })

  // Sync refs to state. Only triggers re-render when elements actually change.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- we guard manually, want this to run on every render
  useLayoutEffect(() => {
    const floatingCurrent = floatingElementRef.current
    const anchorCurrent = anchorElementRef.current
    if (floatingCurrent !== floatingEl) setFloatingEl(floatingCurrent)
    if (anchorCurrent !== anchorEl) setAnchorEl(anchorCurrent)
  })

  // Calculate position - reads from refs for DOM operations, state is only for triggering
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
      // Mutate via ref, not state
      floating.style.height = `${prevHeight}px`
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

  // Coalesce multiple update triggers into a single rAF
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

  // Watch for element resizes
  useLayoutEffect(() => {
    if (!floatingEl && !anchorEl) return

    const observer = new ResizeObserver(scheduleUpdate)

    if (floatingEl) observer.observe(floatingEl)
    if (anchorEl) observer.observe(anchorEl)

    return () => observer.disconnect()
  }, [floatingEl, anchorEl, scheduleUpdate])

  // Watch for window resizes
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
