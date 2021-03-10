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
}

/**
 * Hook used to trap focus inside a container. Returns a ref that can be added to the container
 * that should trap focus.
 * @param settings {FocusTrapHookSettings}
 */
export function useFocusTrap(
  settings?: FocusTrapHookSettings
): {containerRef: React.RefObject<HTMLElement>; initialFocusRef: React.RefObject<HTMLElement>} {
  const containerRef = useProvidedRefOrCreate(settings?.containerRef)
  const initialFocusRef = useProvidedRefOrCreate(settings?.initialFocusRef)
  const disabled = settings?.disabled
  const abortController = React.useRef<AbortController>()

  React.useEffect(() => {
    if (containerRef.current instanceof HTMLElement) {
      if (!disabled) {
        abortController.current = focusTrap(containerRef.current, initialFocusRef.current ?? undefined)
        return () => {
          abortController.current?.abort()
        }
      } else {
        abortController.current?.abort()
      }
    }
  }, [containerRef, initialFocusRef, disabled])

  return {containerRef, initialFocusRef}
}
