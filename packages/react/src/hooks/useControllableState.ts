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
   * A controlled value. Omitting this means that the state is uncontrolled.
   */
  value?: T
  /**
   * An optional function that is called when the value of the state changes.
   * This is useful for communicating to parents of controlled components
   * that the value is requesting to be changed.
   */
  onChange?: (value: T) => void
}

/**
 * This custom hook simplifies the behavior of a component if it has state that
 * can be both controlled and uncontrolled. It functions identical to a
 * useState() hook and provides [state, setState] for you to use. You can use
 * the `onChange` argument to allow updates to the `state` to be communicated to
 * owners of controlled components.
 *
 * Note: This hook will warn if a component is switching from controlled to
 * uncontrolled, or vice-versa.
 */
export function useControllableState<T>({
  name = 'custom',
  defaultValue,
  value,
  onChange,
}: ControllableStateOptions<T>): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, internalSetState] = React.useState(value ?? defaultValue)
  const controlled = React.useRef<boolean | null>(null)
  const stableOnChange = React.useRef(onChange)

  React.useEffect(() => {
    stableOnChange.current = onChange
  })

  if (controlled.current === null) {
    controlled.current = value !== undefined
  }

  const setState = React.useCallback(
    (stateOrUpdater: T | ((prevState: T) => T)) => {
      const value =
        typeof stateOrUpdater === 'function'
          ? // @ts-ignore stateOrUpdater is a function
            stateOrUpdater(state)
          : stateOrUpdater

      if (controlled.current === false) {
        internalSetState(value)
      }

      stableOnChange.current?.(value)
    },
    [state],
  )

  React.useEffect(() => {
    const controlledValue = value !== undefined

    // Uncontrolled -> Controlled
    // If the component prop is uncontrolled, the prop value should be undefined
    if (controlled.current === false && controlledValue) {
      warning(
        true,
        'A component is changing an uncontrolled %s component to be controlled. ' +
          'This is likely caused by the value changing to a defined value ' +
          'from undefined. Decide between using a controlled or uncontrolled ' +
          'value for the lifetime of the component. ' +
          'More info: https://reactjs.org/link/controlled-components',
        name,
      )
    }

    // Controlled -> Uncontrolled
    // If the component prop is controlled, the prop value should be defined
    if (controlled.current === true && !controlledValue) {
      warning(
        true,
        'A component is changing a controlled %s component to be uncontrolled. ' +
          'This is likely caused by the value changing to an undefined value ' +
          'from a defined one. Decide between using a controlled or ' +
          'uncontrolled value for the lifetime of the component. ' +
          'More info: https://reactjs.org/link/controlled-components',
        name,
      )
    }
  }, [name, value])

  // eslint-disable-next-line react-hooks/refs
  if (controlled.current === true) {
    return [value as T, setState]
  }

  return [state, setState]
}
