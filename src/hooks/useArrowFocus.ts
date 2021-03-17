import React, {useEffect} from 'react'
import {arrowFocus, ArrowFocusSettings} from '../behaviors/arrowFocus'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'

export interface ArrowFocusHookSettings extends Omit<ArrowFocusSettings, 'activeDescendantControl'> {
  /**
   * Optional ref for the container that holds all elements participating in arrow key focus.
   * If one is not passed, we will create one for you and return it from the hook.
   */
  containerRef?: React.RefObject<HTMLElement | undefined>

  /**
   * If using the "active descendant" focus pattern, pass `true` or a ref to the controlling
   * element. If a ref object is not passed, we will create one for you.
   */
  activeDescendantFocus?: boolean | React.RefObject<HTMLElement | undefined>
}

export function useArrowFocus(
  settings: ArrowFocusHookSettings = {},
  dependencies?: React.DependencyList
): {containerRef: React.RefObject<HTMLElement>; activeDescendantControlRef: React.RefObject<HTMLElement>} {
  const containerRef = useProvidedRefOrCreate(settings.containerRef)
  const useActiveDescendant = !!settings.activeDescendantFocus
  const passedActiveDescendantRef =
    typeof settings.activeDescendantFocus === 'boolean' || !settings.activeDescendantFocus
      ? undefined
      : settings.activeDescendantFocus
  const activeDescendantControlRef = useProvidedRefOrCreate(passedActiveDescendantRef)

  useEffect(() => {
    let abortController: AbortController | undefined = undefined
    if (
      containerRef.current instanceof HTMLElement &&
      (!useActiveDescendant || activeDescendantControlRef.current instanceof HTMLElement)
    ) {
      const vanillaSettings: ArrowFocusSettings = {
        ...settings,
        activeDescendantControl: activeDescendantControlRef.current ?? undefined
      }
      abortController = arrowFocus(containerRef.current, vanillaSettings)
    }
    return () => {
      abortController?.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies ?? [])

  return {containerRef, activeDescendantControlRef}
}
