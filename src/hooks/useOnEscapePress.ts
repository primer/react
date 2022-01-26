import {useEffect, useCallback} from 'react'

const handlers: ((e: KeyboardEvent) => void)[] = []

/**
 * Calls all handlers in reverse order
 * @param event The KeyboardEvent generated by the Escape keydown.
 */
function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && !event.defaultPrevented) {
    for (let i = handlers.length - 1; i >= 0; --i) {
      handlers[i](event)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (event.defaultPrevented) {
        break
      }
    }
  }
}

/**
 * Sets up a `keydown` listener on element passed | `window.document`. If
 * 1) The pressed key is "Escape", and
 * 2) The event has not had `.preventDefault()` called
 * The given callback will be executed.
 *
 * Note: If multiple `useOnEscapePress` hooks are active simultaneously, the
 * callbacks will occur in reverse order. In other words, if a parent component
 * and a child component both call `useOnEscapePress`, when the user presses
 * Escape, the child component's callback will execute, followed by the parent's
 * callback. Each callback has the chance to call `.preventDefault()` on the
 * event to prevent further callbacks.
 *
 * @param callback {(e: KeyboardEvent) => void} The callback that gets executed
 * when the Escape key is pressed. The KeyboardEvent generated by the Escape
 * keypress is passed as the only argument.
 *
 * @param callbackDependencies {React.DependencyList} The dependencies of the given
 * `onEscape` callback for memoization. Omit this param if the callback is already
 * memoized. See `React.useCallback` for more info on memoization.
 *
 * @param containerRef {React.RefObject<HTMLElement>} The overlay element to attach the
 * handlers on. If not provided, fallback to document.
 */
export const useOnEscapePress = (
  onEscape: (e: KeyboardEvent) => void,
  callbackDependencies: React.DependencyList = [onEscape],
  containerRef: React.RefObject<HTMLElement>
): void => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const escapeCallback = useCallback(onEscape, callbackDependencies)

  useEffect(() => {
    const element = containerRef.current

    if (handlers.length === 0) {
      if (element) element.addEventListener('keydown', handleEscape)
      else document.addEventListener('keydown', handleEscape)
    }
    handlers.push(escapeCallback)
    return () => {
      handlers.splice(
        handlers.findIndex(h => h === escapeCallback),
        1
      )
      if (handlers.length === 0) {
        if (element) element.removeEventListener('keydown', handleEscape)
        else document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [escapeCallback, containerRef])
}
