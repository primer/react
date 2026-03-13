import type {ForwardedRef, Ref as StandardRef, MutableRefObject} from 'react'
import {useCallback} from 'react'

/**
 * Combine two refs of matching type (typically an external or forwarded ref and an internal `useRef` object or
 * callback ref).
 *
 * If you need to combine more than two refs (what are you doing?) just nest the hook:
 * `useCombinedRefs(refA, useCombinedRefs(refB, refC))`
 *
 * @param refA First ref to combine. The order is not important.
 * @param refB Second ref to combine. The order is not important.
 * @returns A new ref which must be passed to the relevant child component. **Important**: do not pass `refA` or
 * `refB` to the component!
 *
 * @example
 * // React 18
 * const Example = forwardRef<HTMLButtonElement, {}>((props, forwardedRef) => {
 *  const ref = useRef<HTMLButtonElement>(null)
 *  const combinedRef = useCombinedRefs(forwardedRef, ref)
 *
 *  return <button ref={combinedRef} />
 * })
 *
 * @example
 * // React 19
 * const Example = ({ref: externalRef}: {ref?: Ref<HTMLButtonElement>}) => {
 *  const ref = useRef<HTMLButtonElement>(null)
 *  const combinedRef = useCombinedRefs(externalRef, ref)
 *
 *  return <button ref={combinedRef} />
 * }
 */
export function useCombinedRefs<T>(refA: Ref<T | null>, refB: Ref<T | null>) {
  return useCallback(
    (value: T | null) => {
      const cleanupA = setRef(refA, value)
      const cleanupB = setRef(refB, value)

      // Only works in React 19. In React 18, the cleanup function will be ignored and the ref will get called with
      // `null` which will be passed to each ref as expected.
      return () => {
        // For object refs and callback refs that don't return cleanups, we still need to pass `null` on cleanup
        if (cleanupA) cleanupA()
        else setRef(refA, null)

        if (cleanupB) cleanupB()
        else setRef(refB, null)
      }
    },
    [refA, refB],
  )
}

type CleanupFunction = () => void

/**
 * React 19 supports callback refs that can return a cleanup function. If a cleanup function is returned, the
 * cleanup is called on unmount **instead** of setting the ref to null.
 */
// bivarianceHack copied from React types
type React19RefCallback<T> = {
  bivarianceHack(instance: T): void | CleanupFunction
}['bivarianceHack']

/**
 * Supporting React 18 and 19 while alleviating the need for any hacks or casts in consumers:
 * - `ForwardedRef` from the React 18 `forwardRef` HOC
 * - `React19RefCallback` for callback refs that can return a cleanup function (this is included in `Ref` in React 19
 *   but not in 18)
 * - `Ref` for standard refs from `useRef` or passed in as React 19 prop
 * - `undefined` to allow for easy use of optional `ref` props in React 19
 */
type Ref<T> = ForwardedRef<T> | React19RefCallback<T> | StandardRef<T> | undefined

function setRef<T>(ref: Ref<T>, value: T) {
  if (typeof ref === 'function') {
    return ref(value)
  } else if (ref) {
    // `React.Ref` is typed as immutable to protect consumers but it's OK to mutate it here. We could just change the
    // type to only accept mutable refs, but then it would be harder to accept refs as props in React 19 because we
    // would have to use the `React.ForwardedRef` type instead of `React.Ref`
    ;(ref as MutableRefObject<T>).current = value
  }
}
