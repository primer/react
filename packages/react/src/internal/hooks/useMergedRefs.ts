import {useCallback} from 'react'

export function useMergedRefs<T>(
  ...refs: Array<React.MutableRefObject<T> | React.ForwardedRef<T> | React.RefCallback<T>>
): React.RefCallback<T> {
  return useCallback((instance: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(instance)
      } else if (ref) {
        ref.current = instance
      }
    }
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs)
}
