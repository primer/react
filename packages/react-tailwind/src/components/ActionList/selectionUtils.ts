import {cn} from '../../internal/cn'

export type SelectionVariant = 'single' | 'multiple' | 'radio'

export function getSelectionRole(role: string | undefined, selectionVariant: SelectionVariant | undefined) {
  if (role === 'menu') {
    if (selectionVariant === 'multiple') return 'menuitemcheckbox'
    if (selectionVariant === 'single' || selectionVariant === 'radio') return 'menuitemradio'
    return 'menuitem'
  }

  return role === 'listbox' ? 'option' : undefined
}

export function getSelectionAttribute(role: string | undefined) {
  return role === 'menuitemcheckbox' || role === 'menuitemradio'
    ? 'aria-checked'
    : role === 'option'
      ? 'aria-selected'
      : undefined
}

/**
 * Base UI accepts state-aware class names. Resolve consumer callbacks at the
 * primitive rather than passing them to `clsx`, which only accepts strings.
 */
export function mergeClassName<State>(
  baseClassName: string,
  className: string | ((state: State) => string | undefined) | undefined,
) {
  return typeof className === 'function'
    ? (state: State) => cn(baseClassName, className(state))
    : cn(baseClassName, className)
}
