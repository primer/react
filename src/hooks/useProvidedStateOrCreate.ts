import {useCallback, useState} from 'react'

/**
 * There are some situations where we only want to create a new ref if one is not provided to a component
 * or hook as a prop. However, due to the `rules-of-hooks`, we cannot conditionally make a call to `React.useRef`
 * only in the situations where the ref is not provided as a prop.
 * This hook aims to encapsulate that logic, so the consumer doesn't need to be concerned with violating `rules-of-hooks`.
 * @param providedRef The ref to use - if undefined, will use the ref from a call to React.useRef
 * @type TRef The type of the RefObject which should be created.
 */
export function useProvidedStateOrCreate<T>(
  externalState?: T,
  setExternalState?: (s: T) => void,
  defaultState?: T
): [T | undefined, (s: T) => void] {
  const [internalState, setInternalState] = useState(defaultState)
  const state = externalState ?? internalState
  const setState = useCallback(
    (s: T) => {
      setInternalState(s)
      if (setExternalState) setExternalState(s)
    },
    [setExternalState]
  )
  return [state, setState]
}
