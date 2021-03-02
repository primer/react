import React from 'react'
import {PositionSettings, getAnchoredPosition} from '../behaviors/anchoredPosition'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'

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
  dependencies?: React.DependencyList
): {
  floatingElementRef: React.RefObject<Element>
  anchorElementRef: React.RefObject<Element>
  position: {top: number; left: number} | undefined
} {
  const floatingElementRef = useProvidedRefOrCreate(settings?.floatingElementRef)
  const anchorElementRef = useProvidedRefOrCreate(settings?.anchorElementRef)
  const [position, setPosition] = React.useState<{top: number; left: number} | undefined>(undefined)
  React.useEffect(() => {
    if (floatingElementRef.current instanceof Element && anchorElementRef.current instanceof Element) {
      setPosition(getAnchoredPosition(floatingElementRef.current, anchorElementRef.current, settings))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies ?? [])
  return {
    floatingElementRef,
    anchorElementRef,
    position
  }
}
