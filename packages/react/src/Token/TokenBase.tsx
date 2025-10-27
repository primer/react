/* eslint-disable primer-react/spread-props-first */
import type {ComponentProps, KeyboardEvent} from 'react'
import React from 'react'
import {clsx} from 'clsx'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import classes from './TokenBase.module.css'

export type TokenSizeKeys = 'small' | 'medium' | 'large' | 'xlarge'

export const tokenSizes: Record<TokenSizeKeys, string> = {
  small: '16px',
  medium: '20px',
  large: '24px',
  xlarge: '32px',
}

export const defaultTokenSize: TokenSizeKeys = 'medium'

export interface TokenBaseProps
  extends Omit<React.HTMLProps<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement>, 'size' | 'id'> {
  as?: 'button' | 'a' | 'span'
  /**
   * The function that gets called when a user clicks the remove button, or keys "Backspace" or "Delete" when focused on the token
   */
  onRemove?: () => void
  /**
   * Whether the remove button should be rendered in the token
   */
  hideRemoveButton?: boolean
  /**
   * Whether the token is selected
   */
  isSelected?: boolean
  /**
   * The text label inside the token
   */
  text: React.ReactNode
  /**
   * A unique identifier that can be associated with the token
   */
  id?: number | string
  /**
   * Which size the token will be rendered at
   */
  size?: TokenSizeKeys
  /**
   * Whether or not the token is disabled (non-interactive).
   */
  disabled?: boolean
}

export const isTokenInteractive = ({
  as = 'span',
  onClick,
  onFocus,
  tabIndex = -1,
  disabled,
}: Pick<ComponentProps<typeof TokenBase>, 'disabled' | 'as' | 'onClick' | 'onFocus' | 'tabIndex'>) => {
  if (disabled) {
    return false
  }
  return Boolean(onFocus || onClick || tabIndex > -1 || ['a', 'button'].includes(as))
}

const TokenBase = React.forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement | undefined, TokenBaseProps>(
  (
    {
      onRemove,
      onKeyDown,
      id,
      className,
      size = defaultTokenSize,
      isSelected: _isSelected,
      as: Component = 'span',
      ...rest
    },
    forwardedRef,
  ) => {
    return (
      <Component
        onKeyDown={(event: KeyboardEvent<HTMLSpanElement & HTMLAnchorElement & HTMLButtonElement>) => {
          onKeyDown && onKeyDown(event)

          if ((event.key === 'Backspace' || event.key === 'Delete') && onRemove) {
            onRemove()
          }
        }}
        className={clsx(classes.TokenBase, className)}
        data-cursor-is-interactive={isTokenInteractive({
          as: Component,
          onClick: rest.onClick,
          onFocus: rest.onFocus,
          tabIndex: rest.tabIndex,
          disabled: rest.disabled,
        })}
        data-size={size}
        id={id?.toString()}
        {...(Component === 'button'
          ? (rest as React.ButtonHTMLAttributes<HTMLButtonElement>)
          : Component === 'a'
            ? (rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)
            : (rest as React.HTMLAttributes<HTMLSpanElement>))}
        // TypeScript cannot resolve polymorphic ref types at compile time
        // This assertion is safe because the ref will match the actual rendered element
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={forwardedRef as any}
      />
    )
  },
) as PolymorphicForwardRefComponent<'span' | 'a' | 'button', TokenBaseProps>

export default TokenBase
