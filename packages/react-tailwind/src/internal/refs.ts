import type React from 'react'

export function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref !== null) {
    ref.current = value
  }
}

/** Combines several refs into a single ref callback. */
export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) assignRef(ref ?? null, node)
  }
}
