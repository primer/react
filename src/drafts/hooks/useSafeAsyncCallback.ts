import {useEffect, useLayoutEffect, useRef} from 'react'

export const callbackCancelledResult = Symbol('callbackCancelledResult')
export type CallbackCancelledResult = typeof callbackCancelledResult

/**
 * Making async callbacks within React components is risky and error-prone. It's easy to
 * accidentally call an outdated reference to the function, or to call it after the
 * component has unmounted.
 *
 * This hook solves these problems by returning a function that is referentially constant
 * (it can never be outdated) and will have no effect if called after unmounting. If the
 * callback is cancelled due to calling after unmounting, the returned value will be
 * the unique symbol `callbackCancelledResult`.
 *
 * This callback is safe to call after `await`ing a `Promise` (or in the `.then` clause of a
 * `Promise`) and in `setTimeout`.
 */
export const useSafeAsyncCallback = <A extends unknown[], R>(
  fn: (...args: A) => R
): ((...args: A) => R | CallbackCancelledResult) => {
  const trackingRef = useRef(fn)
  useLayoutEffect(() => {
    trackingRef.current = fn
  }, [fn])

  const isMountedRef = useRef(false)
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return (...args: A) => (isMountedRef.current ? trackingRef.current(...args) : callbackCancelledResult)
}
