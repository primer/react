import React from 'react'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorPosition, PositionSettings} from '@primer/behaviors'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'
import {useResizeObserver} from './useResizeObserver'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

export interface AnchoredPositionHookSettings extends Partial<PositionSettings> {
  floatingElementRef?: React.RefObject<Element>
  anchorElementRef?: React.RefObject<Element>
  pinPosition?: boolean
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
  floatingElementRef: React.RefObject<Element>
  anchorElementRef: React.RefObject<Element>
  position: AnchorPosition | undefined
} {
  const floatingElementRef = useProvidedRefOrCreate(settings?.floatingElementRef)
  const anchorElementRef = useProvidedRefOrCreate(settings?.anchorElementRef)
  const [position, setPosition] = React.useState<AnchorPosition | undefined>(undefined)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setPrevHeight] = React.useState<number | undefined>(undefined)

  const updatePosition = React.useCallback(
    () => {
      if (floatingElementRef.current instanceof Element && anchorElementRef.current instanceof Element) {
        const newPosition = getAnchoredPosition(floatingElementRef.current, anchorElementRef.current, settings)
        setPosition(prev => {
          if (
            settings?.pinPosition &&
            prev &&
            ['outside-top', 'inside-top'].includes(prev.anchorSide) &&
            (prev.anchorSide !== newPosition.anchorSide || prev.top < newPosition.top)
          ) {
            const anchorTop = anchorElementRef.current?.getBoundingClientRect().top ?? 0
            if (anchorTop > (floatingElementRef.current?.clientHeight ?? 0)) {
              setPrevHeight(prevHeight => {
                if (prevHeight && prevHeight > (floatingElementRef.current?.clientHeight ?? 0)) {
                  requestAnimationFrame(() => {
                    ;(floatingElementRef.current as HTMLElement).style.height = `${prevHeight}px`
                  })
                } else {
                  prev = newPosition
                }
                return prevHeight
              })
              return prev
            }
          }
          return newPosition
        })
      } else {
        setPosition(undefined)
      }
      setPrevHeight(floatingElementRef.current?.clientHeight)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [floatingElementRef, anchorElementRef, ...dependencies],
  )

  useLayoutEffect(updatePosition, [updatePosition])

  useResizeObserver(updatePosition) // watches for changes in window size
  useResizeObserver(updatePosition, floatingElementRef as React.RefObject<HTMLElement>) // watches for changes in floating element size

  return {
    floatingElementRef,
    anchorElementRef,
    position,
  }
}
