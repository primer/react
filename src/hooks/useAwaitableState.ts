import {useCallback, useEffect, useRef, useState} from 'react'

/**
 * Equivalent to React.useState, but the returned `set` function returns
 * a promise that gets resolved after the component re-renders as a result
 * of the state change.
 * @param initialState
 */
export function useAwaitableState<S>(initialState: S | (() => S)) {
  const [_state, setState] = useState(initialState)
  const resolver = useRef<(val?: unknown) => void>()

  const setStateAwaitable = useCallback(async (state: S | (() => S)) => {
    const setStatePromise = new Promise(resolve => {
      resolver.current = resolve
    })
    setState(state)
    return setStatePromise
  }, [])

  useEffect(() => {
    if (resolver.current) {
      resolver.current()
      resolver.current = undefined
    }
  }, [_state])

  return [_state, setStateAwaitable] as const
}
