import {cn} from './cn'

/**
 * Base UI accepts state-aware class names. Resolve consumer callbacks before
 * composing the result with the component's default classes.
 */
export function mergeClassName<State>(
  baseClassName: string,
  className: string | ((state: State) => string | undefined) | undefined,
) {
  return typeof className === 'function'
    ? (state: State) => cn(baseClassName, className(state))
    : cn(baseClassName, className)
}
