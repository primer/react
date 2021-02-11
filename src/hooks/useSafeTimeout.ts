import {useCallback, useEffect, useRef} from 'react'

/**
 * Safely call `setTimeout` and `clearTimeout` within a component.
 *
 * This hook ensures that all timeouts are cleared when the component unmounts.
 */
export default function useSafeTimeout(): {safeSetTimeout: typeof window.setTimeout; safeClearTimeout: typeof window.clearTimeout} {
  const timers = useRef<Record<string, number>>({})

  const safeSetTimeout = useCallback((handler: TimerHandler, timeout?: number | undefined, ...args: any[]): number => {
    const id = window.setTimeout(handler, timeout, ...args)
    timers.current[id] = id
    return id
  }, [])

  const safeClearTimeout = useCallback((id: number) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(timers.current).forEach(clearTimeout)
    }
  }, [])

  return {safeSetTimeout, safeClearTimeout}
}
