import React from 'react'
import {focusTrap} from '../behaviors/focusTrap'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'

interface FocusTrapHookSettings {
  containerRef?: React.RefObject<HTMLElement>
  initialFocusRef?: React.RefObject<HTMLElement>
  disabled?: boolean
}

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
