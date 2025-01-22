import {useState} from 'react'

/**
 * When the value that initialized the state changes
 * this hook will update the state to the new value, immediately.
 *
 * This uses an Object.is comparison to determine if the value has changed by default
 *
 * If you use a non-primitive value as the initial value, you should provide a custom isEqual function
 *
 * This is adapted almost directly from https://beta.reactjs.org/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 */

export const useSyncedState = <T,>(
  initialValue: T | (() => T),
  {isPropUpdateDisabled = false, isEqual = Object.is} = {},
) => {
  const [state, setState] = useState(initialValue)
  const [previous, setPrevious] = useState(initialValue)

  const nextInitialValue = initialValue instanceof Function ? initialValue() : initialValue
  if (!isPropUpdateDisabled && !isEqual(previous, nextInitialValue)) {
    setPrevious(nextInitialValue)
    setState(nextInitialValue)
  }

  return [state, setState] as const
}
