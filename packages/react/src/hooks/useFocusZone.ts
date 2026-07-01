import React, {useEffect} from 'react'
import {focusZone} from '@primer/behaviors'
import type {FocusZoneSettings} from '@primer/behaviors'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'
import {useValueWithDependencies} from './useDependencies'
export {FocusKeys} from '@primer/behaviors'
export type {Direction} from '@primer/behaviors'

export interface FocusZoneHookSettings extends Omit<FocusZoneSettings, 'activeDescendantControl'> {
  /**
   * Optional ref for the container that holds all elements participating in arrow key focus.
   * If one is not passed, we will create one for you and return it from the hook.
   */
  containerRef?: React.RefObject<HTMLElement | null>

  /**
   * If using the "active descendant" focus pattern, pass `true` or a ref to the controlling
   * element. If a ref object is not passed, we will create one for you.
   */
  activeDescendantFocus?: boolean | React.RefObject<HTMLElement | null>

  /**
   * Set to true to disable the focus zone and clean up listeners. Can be re-enabled at
   * any time.
   */
  disabled?: boolean

  /**
   * Set to true to allow focus to move to elements that are dynamically prepended to the container.
   */
  focusPrependedElements?: boolean
}

export function useFocusZone(
  settings: FocusZoneHookSettings = {},
  dependencies: React.DependencyList = [],
): {
  containerRef: React.RefObject<HTMLElement | null>
  activeDescendantControlRef: React.RefObject<HTMLElement | null>
} {
  const containerRef = useProvidedRefOrCreate(settings.containerRef)
  const useActiveDescendant = !!settings.activeDescendantFocus
  const passedActiveDescendantRef =
    typeof settings.activeDescendantFocus === 'boolean' || !settings.activeDescendantFocus
      ? undefined
      : settings.activeDescendantFocus
  const activeDescendantControlRef = useProvidedRefOrCreate(passedActiveDescendantRef)
  const disabled = settings.disabled
  const {signal: settingsSignal, value: focusZoneSettings} = useValueWithDependencies(settings, [
    disabled,
    ...dependencies,
  ])
  const abortController = React.useRef<AbortController>()

  useEffect(() => {
    if (
      containerRef.current instanceof HTMLElement &&
      // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler
      (!useActiveDescendant || activeDescendantControlRef.current instanceof HTMLElement)
    ) {
      if (!disabled) {
        const vanillaSettings: FocusZoneSettings = {
          ...focusZoneSettings,
          activeDescendantControl: activeDescendantControlRef.current ?? undefined,
        }
        abortController.current = focusZone(containerRef.current, vanillaSettings)
        return () => {
          abortController.current?.abort()
        }
      } else {
        abortController.current?.abort()
      }
    }
  }, [activeDescendantControlRef, containerRef, disabled, focusZoneSettings, settingsSignal, useActiveDescendant])

  return {containerRef, activeDescendantControlRef}
}
