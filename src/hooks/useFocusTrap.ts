import React from 'react'
import {focusTrap} from '../behaviors/focusTrap'

interface FocusTrapHookSettings {
  containerRef?: React.RefObject<HTMLElement>
  disabled?: boolean
}

export function useFocusTrap(
  settings?: FocusTrapHookSettings
): {containerProps: {ref: React.MutableRefObject<HTMLElement | undefined>}} {
  const containerRef = React.useRef<HTMLElement>()
  // const containerRef = useProvidedRefOrCreate(settings?.containerRef)
  const disabled = settings?.disabled
  const abortController = React.useRef<AbortController>()

  console.log('hook!')

  React.useEffect(() => {
    console.log('effect!')
    if (containerRef.current instanceof HTMLElement) {
      console.log('instance!')
      if (!disabled) {
        abortController.current = new AbortController()
        focusTrap(containerRef.current, abortController.current.signal)
        console.log('trapping!')
        return () => {
          abortController.current?.abort()
          console.log('aborted (unmounted)')
        }
      } else {
        abortController.current?.abort()
        console.log('aborted (disabled)')
      }
    }
  }, [containerRef, disabled])

  return {containerProps: {ref: containerRef}}
}
