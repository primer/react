import React from 'react'

// used in doc comment
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {useMergedRefs} from './useMergedRefs'

/**
 * There are some situations where we only want to create a new ref if one is not provided to a component
 * or hook as a prop. However, due to the `rules-of-hooks`, we cannot conditionally make a call to `React.useRef`
 * only in the situations where the ref is not provided as a prop.
 * This hook aims to encapsulate that logic, so the consumer doesn't need to be concerned with violating `rules-of-hooks`.
 * @param providedRef The ref to use - if undefined, will use the ref from a call to React.useRef
 * @type TRef The type of the RefObject which should be created.
 *
 * @note This hook is overly restrictive in that it forces the provided ref to be a ref object rather than a callback.
 * In particular, it should **not** be used to merge internal refs with forwarded refs. For this, use
 * {@linkcode useMergedRefs} instead.
 *
 * The primary valid use case for this hook is for when the consumer is using the provided ref to point to an external
 * element, like an externally rendered anchor. This is 'backwards' from forwarded refs with respect to data flow; the
 * consumer is passing a reference to an external element, rather than passing a handle to obtain a reference to an
 * internal element.
 */
export function useProvidedRefOrCreate<TRef>(providedRef?: React.RefObject<TRef | null>): React.RefObject<TRef | null> {
  const createdRef = React.useRef<TRef>(null)
  return providedRef ?? createdRef
}
