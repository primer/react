import {useCallback, useEffect, useRef} from 'react'

type SetTimeout = (handler: TimerHandler, timeout?: number, ...args: unknown[]) => number
type ClearTimeout = (id: number) => void

/**
 * Safely call `setTimeout` and `clearTimeout` within a component.
 *
 * This hook ensures that all timeouts are cleared when the component unmounts.
 */
export default function useSafeTimeout(): {safeSetTimeout: SetTimeout; safeClearTimeout: ClearTimeout} {
  const timersRef = useRef<Set<number>>(new Set<number>())

  const safeSetTimeout = useCallback(
    (handler: TimerHandler, timeout?: number | undefined, ...args: unknown[]): number => {
      const id = window.setTimeout(handler, timeout, ...args)
      timersRef.current.add(id)
      return id
    },
    [],
  )

  const safeClearTimeout = useCallback((id: number) => {
    clearTimeout(id)
    timersRef.current.delete(id)
  }, [])

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      for (const id of timersRef.current) {
        clearTimeout(id)
      }
    }
  }, [])

  return {safeSetTimeout, safeClearTimeout}
}
