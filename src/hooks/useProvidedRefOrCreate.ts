import React, { useEffect } from 'react'

/**
 * There are some situations where we only want to create a new ref if one is not provided to a component
 * or hook as a prop. However, due to the `rules-of-hooks`, we cannot conditionally make a call to `React.useRef`
 * only in the situations where the ref is not provided as a prop.
 * This hook aims to encapsulate that logic, so the consumer doesn't need to be concerned with violating `rules-of-hooks`.
 *
 * This hook also handles the case where the forwarded ref is a callback ref. See https://medium.com/@jacobwarduk/how-to-correctly-use-preventdefault-stoppropagation-or-return-false-on-events-6c4e3f31aedb
 * @param providedRef The ref to use - if undefined, will use the ref from a call to React.useRef
 * @type TRef The type of the RefObject which should be created.
 */

export function useProvidedRefOrCreate<TRef>(providedRef?: React.ForwardedRef<TRef> | null): React.RefObject<TRef> | React.ForwardedRef<TRef> {
  const createdRef = React.useRef<TRef | null>(null)
  const overlayRef = providedRef ?? createdRef
  return overlayRef
}
