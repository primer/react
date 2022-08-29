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
  const [isAnchorOutsideClippingRect, setAnchorOutsideClippingRect] = React.useState(false)

  const updatePosition = React.useCallback(
    () => {
      if (isAnchorOutsideClippingRect) {
        setPosition(undefined)
      } else if (floatingElementRef.current instanceof Element && anchorElementRef.current instanceof Element) {
        setPosition(getAnchoredPosition(floatingElementRef.current, anchorElementRef.current, settings))
      } else {
        setPosition(undefined)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [floatingElementRef, anchorElementRef, isAnchorOutsideClippingRect, ...dependencies]
  )

  useLayoutEffect(updatePosition, [updatePosition])

  useResizeObserver(updatePosition)

  // when anchorElement's position changes (example, on scroll), updatePosition for floatingElement
  React.useEffect(
    function observeAnchorPosition() {
      if (floatingElementRef.current instanceof Element && anchorElementRef.current instanceof Element) {
        const rectObserver = observeRect(anchorElementRef.current, anchorRect => {
          if (anchorElementRef.current instanceof Element) {
            const clippingRect = getClippingDOMRect(anchorElementRef.current)
            setAnchorOutsideClippingRect(anchorRect.top > clippingRect.bottom || anchorRect.bottom < clippingRect.top)
          }
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

/**
 * Based on primer/behaviors: https://github.com/primer/behaviors/blob/main/src/anchored-position.ts#L188
 *
 * Returns the rectangle (relative to the window) that will clip the given element
 * if it is rendered outside of its bounds.
 */
function getClippingDOMRect(element: Element): DOMRect {
  let parentNode: typeof element.parentNode = element
  while (parentNode !== null) {
    if (parentNode === document.body) {
      break
    }
    const parentNodeStyle = getComputedStyle(parentNode as Element)
    if (parentNodeStyle.overflow !== 'visible') {
      break
    }
    parentNode = parentNode.parentNode
  }
  const clippingNode = parentNode === document.body || !(parentNode instanceof HTMLElement) ? document.body : parentNode

  return clippingNode.getBoundingClientRect()
}
