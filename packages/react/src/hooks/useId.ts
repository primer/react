import {useId as useReactId} from 'react'

/**
 * Generate a unique id to be used in a component. If an `id` is provided, it
 * will be used instead. An optional `prefix` makes generated ids
 * self-documenting in DevTools and the DOM (e.g. `leading-visual-:r0:`).
 *
 * @param id - An optional value to be used instead of generating a unique id.
 * Useful when accepting an optional `id` as a prop in a component. When provided,
 * the `prefix` argument is ignored.
 * @param prefix - An optional human-readable label that is prepended to the
 * generated id. Has no effect when `id` is provided.
 */
export function useId(id?: string, prefix?: string): string {
  const uniqueId = useReactId()
  if (id) {
    return id
  }
  if (prefix) {
    return `${prefix}-${uniqueId}`
  }
  return uniqueId
}
