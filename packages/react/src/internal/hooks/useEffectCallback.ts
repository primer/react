import {useCallback, useEffect, useRef} from 'react'

/**
 * Create a callback that can be used within an effect without re-running the
 * effect when the values used change. The callback passed to this hook will
 * always see the latest snapshot of values that it uses and does not need to
 * use a dependency array.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEffectCallback<T extends (...args: any) => any>(callback: T) {
  const savedCallback = useRef<T>(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return savedCallback.current(...args)
  }, [])
}
