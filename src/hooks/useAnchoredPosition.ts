import React from 'react'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorPosition, PositionSettings} from '@primer/behaviors'
import observeRect from '@reach/observe-rect'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'
import {useResizeObserver} from './useResizeObserver'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

export interface AnchoredPositionHookSettings extends Partial<PositionSettings> {
  floatingElementRef?: React.RefObject<Element>
  anchorElementRef?: React.RefObject<Element>
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
  dependencies: React.DependencyList = []
): {
  floatingElementRef: React.RefObject<Element>
  anchorElementRef: React.RefObject<Element>
  position: AnchorPosition | undefined
} {
  const floatingElementRef = useProvidedRefOrCreate(settings?.floatingElementRef)
  const anchorElementRef = useProvidedRefOrCreate(settings?.anchorElementRef)
  const [position, setPosition] = React.useState<AnchorPosition | undefined>(undefined)
  const [anchorOutsideWindow, setAnchorOutOfWindow] = React.useState(false)

  const updatePosition = React.useCallback(
    () => {
      if (floatingElementRef.current instanceof Element && anchorElementRef.current instanceof Element) {
        const anchoredPositionSettings = {
          ...settings,
          // if the anchor is out of window, force-allow the floatingElement to follow it outside the window
          allowOutOfBounds: anchorOutsideWindow ? true : settings?.allowOutOfBounds,
          // when the anchor moves out of the window, the floatingElement might still be inside
          // we don't want to the floatingElement to change to the other side once allowOutOfBounds toggles
          // so we "maintain" the value of side till the anchor comes back inside window
          // see https://github.com/primer/react/pull/2200 for visuals
          side: anchorOutsideWindow ? position?.anchorSide : settings?.side
        }
        setPosition(getAnchoredPosition(floatingElementRef.current, anchorElementRef.current, anchoredPositionSettings))
      } else {
        setPosition(undefined)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [floatingElementRef, anchorElementRef, anchorOutsideWindow, ...dependencies]
  )

  useLayoutEffect(updatePosition, [updatePosition])

  useResizeObserver(updatePosition)

  // when anchorElement's position changes (example, on scroll), updatePosition for floatingElement
  React.useEffect(
    function observeAnchorPosition() {
      if (floatingElementRef.current instanceof Element && anchorElementRef.current instanceof Element) {
        const rectObserver = observeRect(anchorElementRef.current, rect => {
          setAnchorOutOfWindow(rect.top > window.innerHeight || rect.bottom < 0)
          updatePosition()
        })
        rectObserver.observe()
        return () => rectObserver.unobserve()
      }
    },
    [floatingElementRef, anchorElementRef, updatePosition]
  )

  return {
    floatingElementRef,
    anchorElementRef,
    position
  }
}
