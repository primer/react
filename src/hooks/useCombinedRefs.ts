import {ForwardedRef, useCallback, useEffect, useMemo, useRef} from 'react'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

/**
 * Ref that can perform a side effect on change while also providing access to the current
 * value through `.current`.
 */
const useObservableRef = <T>(initialValue: T, onChange: (value: T) => void) => {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  return useMemo(
    () =>
      new Proxy<React.MutableRefObject<T>>(
        {current: initialValue},
        {
          set(target, prop, value) {
            if (prop === 'current') {
              target[prop] = value
              onChangeRef.current(value)
              return true
            }
            return false
          }
        }
      ),
    // This dependency array MUST be empty because ref objects are guarunteed to be constant
    // and we don't need to track initialValue
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}

/**
 * Creates a ref by combining multiple constituent refs. The ref returned by this hook
 * should be passed as the ref for the element that needs to be shared. This is
 * particularly useful when you are using `React.forwardRef` in your component but you
 * also want to be able to access the local element. This is a small anti-pattern,
 * though, as it breaks encapsulation.
 * @param refs
 */
export function useCombinedRefs<T>(...refs: (ForwardedRef<T> | null | undefined)[]) {
  const syncRefs = useCallback(
    (value: T | null) => {
      for (const ref of refs) {
        if (!ref) continue

        if (typeof ref === 'function') {
          ref(value ?? null)
        } else {
          ref.current = value ?? null
        }
      }
    },
    [refs]
  )

  const targetRef = useObservableRef<T | null>(null, syncRefs)

  useEffect(() => syncRefs(targetRef.current), [syncRefs, targetRef])

  return targetRef
}
