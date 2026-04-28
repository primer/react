import React from 'react'
import {warning} from '../utils/warning'

type ControllableStateOptions<T> = {
  /**
   * A unique name for the state value.
   */
  name?: string
  /**
   * The default value used for the state. This will be
   * the fallback value used if `value` is not defined.
   * */
  defaultValue: T | (() => T)
  /**
   * A controlledRef value. Omitting this means that the state is uncontrolled.
   */
  value?: T
  /**
   * An optional function that is called when the value of the state changes.
   * This is useful for communicating to parents of controlledRef components
   * that the value is requesting to be changed.
   */
  onChange?: (value: T) => void
}

/**
 * This custom hook simplifies the behavior of a component if it has state that
 * can be both controlledRef and uncontrolled. It functions identical to a
 * useState() hook and provides [state, setState] for you to use. You can use
 * the `onChange` argument to allow updates to the `state` to be communicated to
 * owners of controlledRef components.
 *
 * Note: This hook will warn if a component is switching from controlledRef to
 * uncontrolled, or vice-versa.
 */
export function useControllableState<T>({
  name = 'custom',
  defaultValue,
  value,
  onChange,
}: ControllableStateOptions<T>): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [internalState, setInternalState] = React.useState(value ?? defaultValue)
  const controlledRef = React.useRef<boolean | null>(null)
  const stableOnChangeRef = React.useRef(onChange)

  React.useEffect(() => {
    stableOnChangeRef.current = onChange
  })

  if (controlledRef.current === null) {
    controlledRef.current = value !== undefined
  }

  const setState = React.useCallback(
    (stateOrUpdater: T | ((prevState: T) => T)) => {
      const value =
        typeof stateOrUpdater === 'function'
          ? // @ts-ignore stateOrUpdater is a function
            stateOrUpdater(internalState)
          : stateOrUpdater

      if (controlledRef.current === false) {
        setInternalState(value)
      }

      stableOnChangeRef.current?.(value)
    },
    [internalState],
  )

  React.useEffect(() => {
    const controlledValue = value !== undefined

    // Uncontrolled -> Controlled
    // If the component prop is uncontrolled, the prop value should be undefined
    if (controlledRef.current === false && controlledValue) {
      warning(
        true,
        'A component is changing an uncontrolled %s component to be controlledRef. ' +
          'This is likely caused by the value changing to a defined value ' +
          'from undefined. Decide between using a controlledRef or uncontrolled ' +
          'value for the lifetime of the component. ' +
          'More info: https://reactjs.org/link/controlledRef-components',
        name,
      )
    }

    // Controlled -> Uncontrolled
    // If the component prop is controlledRef, the prop value should be defined
    if (controlledRef.current === true && !controlledValue) {
      warning(
        true,
        'A component is changing a controlledRef %s component to be uncontrolled. ' +
          'This is likely caused by the value changing to an undefined value ' +
          'from a defined one. Decide between using a controlledRef or ' +
          'uncontrolled value for the lifetime of the component. ' +
          'More info: https://reactjs.org/link/controlledRef-components',
        name,
      )
    }
  }, [name, value])

  // eslint-disable-next-line react-hooks/refs
  if (controlledRef.current === true) {
    return [value as T, setState]
  }

  return [state, setState]
}
