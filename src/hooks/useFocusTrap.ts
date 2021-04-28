import React from 'react'
import {focusTrap} from '../behaviors/focusTrap'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'

interface FocusTrapHookSettings {
  /**
   * Ref that will be used for the trapping container. If not provided, one will
   * be created by this hook and returned.
   */
  containerRef?: React.RefObject<HTMLElement>

  /**
   * Ref for the element that should receive focus when the focus trap is first enabled. If
   * not provided, one will be created by this hook and returned. Its use is optional.
   */
  initialFocusRef?: React.RefObject<HTMLElement>

  /**
   * Set to true to disable the focus trap and clean up listeners. Can be re-enabled at
   * any time.
   */
  disabled?: boolean

  /**
   * Return focus to the specified element when the focus trap is cleaned up or disabled.
   * If true, return focus to the element that was focused immediately before the focus
   * trap was enabled. If a function is passed, it will be called when the focus trap is
   * cleaned up to determine the element to return focus to. (Default: false)
   */
  restoreFocusOnCleanUp?: HTMLElement | boolean | (() => HTMLElement | boolean)
}

/**
 * Hook used to trap focus inside a container. Returns a ref that can be added to the container
 * that should trap focus.
 * @param settings {FocusTrapHookSettings}
 */
export function useFocusTrap(
  settings?: FocusTrapHookSettings,
  dependencies: React.DependencyList = []
): {containerRef: React.RefObject<HTMLElement>; initialFocusRef: React.RefObject<HTMLElement>} {
  const containerRef = useProvidedRefOrCreate(settings?.containerRef)
  const initialFocusRef = useProvidedRefOrCreate(settings?.initialFocusRef)
  const disabled = settings?.disabled
  const abortController = React.useRef<AbortController>()
  const previousFocusedElement = React.useRef<Element | null>(null)

  // If we are enabling a focus trap and haven't already stored the previously focused element
  // go ahead an do that so we can restore later when the trap is disabled.
  if (!previousFocusedElement.current && !settings?.disabled) {
    previousFocusedElement.current = document.activeElement
  }

  // This function removes the event listeners that enable the focus trap and restores focus
  // to the previously-focused element (if necessary).
  function disableTrap() {
    abortController.current?.abort()
    let restoreFocusTo: Element | null =
      settings?.restoreFocusOnCleanUp !== false ? previousFocusedElement.current : null
    if (typeof settings?.restoreFocusOnCleanUp === 'function') {
      const result = settings.restoreFocusOnCleanUp()
      if (result instanceof HTMLElement) {
        restoreFocusTo = result
      } else if (result !== true) {
        restoreFocusTo = null
      }
    }
    if (restoreFocusTo instanceof HTMLElement) {
      restoreFocusTo.focus()
      previousFocusedElement.current = null
    }
  }

  React.useEffect(
    () => {
      if (containerRef.current instanceof HTMLElement) {
        if (!disabled) {
          abortController.current = focusTrap(containerRef.current, initialFocusRef.current ?? undefined)
          return () => {
            disableTrap()
          }
        } else {
          disableTrap()
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerRef, initialFocusRef, disabled, ...dependencies]
  )

  return {containerRef, initialFocusRef}
}
