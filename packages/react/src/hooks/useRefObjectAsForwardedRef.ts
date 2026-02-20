import type {ForwardedRef, RefObject} from 'react'
import {useImperativeHandle} from 'react'

/**
 * Use a ref object as the imperative handle for a forwarded ref. This can be used to
 * synchronize the ref object with the forwarded ref and allow local access the reference
 * instance with `.current`.
 *
 * **NOTE**: The `refObject` should be passed to the underlying element, NOT the `forwardedRef`.
 */
export function useRefObjectAsForwardedRef<T>(forwardedRef: ForwardedRef<T>, refObject: RefObject<T | null>): void {
  // The ref object is stable (from useRef), so this factory only needs to run once.
  // Without the dependency array, useImperativeHandle re-runs the factory every render.
  useImperativeHandle<T | null, T | null>(forwardedRef, () => refObject.current, [refObject])
}
