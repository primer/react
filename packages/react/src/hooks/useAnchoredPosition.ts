import React from 'react'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorPosition, PositionSettings} from '@primer/behaviors'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'
import {useResizeObserver} from './useResizeObserver'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

export interface AnchoredPositionHookSettings<
  TAnchorElement extends Element = HTMLDivElement,
  TFloatingElement extends Element = HTMLDivElement,
> extends Partial<PositionSettings> {
  floatingElementRef?: React.RefObject<TFloatingElement>
  anchorElementRef?: React.RefObject<TAnchorElement>
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
export function useAnchoredPosition<
  TAnchorElement extends Element = HTMLDivElement,
  TFloatingElement extends Element = HTMLDivElement,
>(
  settings?: AnchoredPositionHookSettings<TAnchorElement, TFloatingElement>,
  dependencies: React.DependencyList = [],
): {
  floatingElementRef: React.RefObject<TFloatingElement>
  anchorElementRef: React.RefObject<TAnchorElement>
  position: AnchorPosition | undefined
} {
  const floatingElementRef = useProvidedRefOrCreate<TFloatingElement>(settings?.floatingElementRef)
  const anchorElementRef = useProvidedRefOrCreate<TAnchorElement>(settings?.anchorElementRef)
  const [position, setPosition] = React.useState<AnchorPosition | undefined>(undefined)

  const updatePosition = React.useCallback(
    () => {
      if (floatingElementRef.current instanceof Element && anchorElementRef.current instanceof Element) {
        setPosition(getAnchoredPosition(floatingElementRef.current, anchorElementRef.current, settings))
      } else {
        setPosition(undefined)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [floatingElementRef, anchorElementRef, ...dependencies],
  )

  useLayoutEffect(updatePosition, [updatePosition])

  useResizeObserver(updatePosition)

  return {
    floatingElementRef,
    anchorElementRef,
    position,
  }
}
