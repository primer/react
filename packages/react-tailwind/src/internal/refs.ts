import type React from 'react'

export function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref !== null) {
    ref.current = value
  }
}

/**
 * Combines several refs into a single ref callback. Cleanup functions returned by callback refs run when the node
 * detaches; other refs are reset to `null`.
 *
 * The merged callback never returns a cleanup itself: it handles the detach call (`null`) directly, which keeps it
 * compatible with renderers that predate callback-ref cleanups, such as React 18.
 */
export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  let cleanups: Array<ReturnType<React.RefCallback<T>>> = []
  return (node: T | null) => {
    if (node === null) {
      for (const [index, ref] of refs.entries()) {
        const cleanup = cleanups[index]
        if (typeof cleanup === 'function') cleanup()
        else assignRef(ref ?? null, null)
      }
      cleanups = []
      return
    }
    cleanups = refs.map(ref => (typeof ref === 'function' ? ref(node) : assignRef(ref ?? null, node)))
  }
}
