import {useCallback, useEffect, useRef} from 'react'

type SetTimeout = (handler: TimerHandler, timeout?: number, ...args: any[]) => number
type ClearTimeout = (id: number) => void

/**
 * Safely call `setTimeout` and `clearTimeout` within a component.
 *
 * This hook ensures that all timeouts are cleared when the component unmounts.
 */
export default function useSafeTimeout(): {safeSetTimeout: SetTimeout; safeClearTimeout: ClearTimeout} {
  const timers = useRef<Set<number>>(new Set<number>())

  const safeSetTimeout = useCallback((handler: TimerHandler, timeout?: number | undefined, ...args: any[]): number => {
    const id = window.setTimeout(handler, timeout, ...args)
    timers.current.add(id)
    return id
  }, [])

  const safeClearTimeout = useCallback((id: number) => {
    clearTimeout(id)
    timers.current.delete(id)
  }, [])

  useEffect(() => {
    return () => {
      for (const id of timers.current) {
        clearTimeout(id)
      }
    }
  }, [])

  return {safeSetTimeout, safeClearTimeout}
}
