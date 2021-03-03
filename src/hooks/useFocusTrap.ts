import React from 'react'
import {focusTrap} from '../behaviors/focusTrap'
import { useProvidedRefOrCreate } from './useProvidedRefOrCreate'

interface FocusTrapHookSettings {
  containerRef?: React.RefObject<HTMLElement>
  disabled?: boolean
}

export function useFocusTrap(
  settings?: FocusTrapHookSettings
): {containerProps: {ref: React.RefObject<HTMLElement>}} {
  const containerRef = useProvidedRefOrCreate(settings?.containerRef)
  const disabled = settings?.disabled
  const abortController = React.useRef<AbortController>()

  React.useEffect(() => {
    if (containerRef.current instanceof HTMLElement) {
      if (!disabled) {
        abortController.current = new AbortController()
        focusTrap(containerRef.current, abortController.current.signal)
        return () => {
          abortController.current?.abort()
        }
      } else {
        abortController.current?.abort()
      }
    }
  }, [containerRef, disabled])

  return {containerProps: {ref: containerRef}}
}
