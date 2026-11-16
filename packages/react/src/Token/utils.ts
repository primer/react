import type {TokenBaseProps} from './TokenBase'

export const isTokenInteractive = ({
  as = 'span',
  onClick,
  onFocus,
  tabIndex = -1,
  disabled,
}: Pick<TokenBaseProps, 'disabled' | 'as' | 'onClick' | 'onFocus' | 'tabIndex'>) => {
  if (disabled) {
    return false
  }
  return Boolean(onFocus || onClick || tabIndex > -1 || ['a', 'button'].includes(as))
}
