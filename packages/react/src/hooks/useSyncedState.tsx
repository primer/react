import {useState} from 'react'
import type React from 'react'

/**
 * When the value that initialized the state changes
 * this hook will update the state to the new value, immediately.
 *
 * This uses an Object.is comparison to determine if the value has changed by default
 *
 * If you use a non-primitive value as the initial value, you should provide a custom isEqual function
 *
 * This is adapted almost directly from https://beta.reactjs.org/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 *
 * @param initialValue The initial value, mirroring `useState` this accepts either a value or a memoized function that returns an initial value
 * @param opts.isPropUpdateDisabled Whether to skip the update, this is uncommon, but might happen while a form is dirty or something like that
 * @param opts.isEqual The comparison function to use, by default `Object.is` is used
 */
export function useSyncedState<T>(
  initialValue: T | (() => T),
  {isPropUpdateDisabled = false, isEqual = Object.is} = {},
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(initialValue)
  const [previousValue, setPreviousValue] = useState(() => initialValue)
  /**
   * This is _not_ done in effect, but instead during render.
   *
   * This is safe because it's in the same component. React will immediately queue an update, and
   * avoid the work in the render pass, which saves a potentially large render cycle that would
   * get thrown away immediately
   */
  if (!isPropUpdateDisabled && !isEqual(previousValue, initialValue)) {
    setPreviousValue(() => initialValue)
    setValue(initialValue)
  }

  return [value, setValue] as const
}
