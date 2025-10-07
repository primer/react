import React from 'react'
import {computePosition, flip, offset, type Placement} from '@floating-ui/dom'
import type {AnchorPosition, PositionSettings} from '@primer/behaviors'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'
import {useResizeObserver} from './useResizeObserver'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

export interface AnchoredPositionHookSettings extends Partial<PositionSettings> {
  floatingElementRef?: React.RefObject<Element>
  anchorElementRef?: React.RefObject<Element>
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
  floatingElementRef: React.RefObject<Element>
  anchorElementRef: React.RefObject<Element>
  position: AnchorPosition | undefined
} {
  const floatingElementRef = useProvidedRefOrCreate(settings?.floatingElementRef)
  const anchorElementRef = useProvidedRefOrCreate(settings?.anchorElementRef)
  const savedOnPositionChange = React.useRef(settings?.onPositionChange)
  const [position, setPosition] = React.useState<AnchorPosition | undefined>(undefined)

  const settingsToPlacement = (s?: Partial<PositionSettings>): Placement => {
    const side = s?.side ?? 'outside-bottom'
    const align = s?.align ?? 'center'
    const sideMap: Record<string, string> = {
      'outside-top': 'top',
      'outside-bottom': 'bottom',
      'outside-left': 'left',
      'outside-right': 'right',
    }
    const base = sideMap[side] || 'bottom'
    if (align === 'center') return base as Placement
    return `${base}-${align}` as Placement
  }

  const placementToAnchor = (
    placement: Placement,
  ): {anchorSide: AnchorPosition['anchorSide']; anchorAlign: AnchorPosition['anchorAlign']} => {
    const [base, maybeAlign] = placement.split('-') as [string, string?]
    const sideMap: Record<string, AnchorPosition['anchorSide']> = {
      top: 'outside-top',
      bottom: 'outside-bottom',
      left: 'outside-left',
      right: 'outside-right',
    }
    const anchorSide = sideMap[base as keyof typeof sideMap] ?? 'outside-bottom'
    let anchorAlign: AnchorPosition['anchorAlign'] = 'center'
    if (maybeAlign === 'start') anchorAlign = 'start'
    else if (maybeAlign === 'end') anchorAlign = 'end'
    return {anchorSide, anchorAlign}
  }

  const updatePosition = React.useCallback(() => {
    if (!(floatingElementRef.current instanceof Element) || !(anchorElementRef.current instanceof Element)) {
      setPosition(undefined)
      savedOnPositionChange.current?.(undefined)
      return
    }
    const placement = settingsToPlacement(settings)
    ;(async () => {
      try {
        const {
          x,
          y,
          placement: finalPlacement,
        } = await computePosition(anchorElementRef.current as HTMLElement, floatingElementRef.current as HTMLElement, {
          placement,
          middleware: [offset(settings?.anchorOffset ?? 4), flip()],
        })
        const {anchorSide, anchorAlign} = placementToAnchor(finalPlacement as Placement)
        const newPosition: AnchorPosition = {
          top: y,
          left: x,
          anchorSide,
          anchorAlign,
        }
        setPosition(prev => {
          if (
            !prev ||
            prev.top !== newPosition.top ||
            prev.left !== newPosition.left ||
            prev.anchorSide !== newPosition.anchorSide ||
            prev.anchorAlign !== newPosition.anchorAlign
          ) {
            savedOnPositionChange.current?.(newPosition)
            return newPosition
          }
          return prev
        })
      } catch {
        /* swallow */
      }
    })()
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floatingElementRef, anchorElementRef, settings, ...dependencies])

  useLayoutEffect(() => {
    savedOnPositionChange.current = settings?.onPositionChange
  }, [settings?.onPositionChange])

  useLayoutEffect(() => {
    updatePosition()
  }, [updatePosition])

  useResizeObserver(updatePosition)
  useResizeObserver(updatePosition, floatingElementRef as React.RefObject<HTMLElement>)
  useResizeObserver(updatePosition, anchorElementRef as React.RefObject<HTMLElement>)

  return {
    floatingElementRef,
    anchorElementRef,
    position,
  }
}
