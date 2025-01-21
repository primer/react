import type {ComponentProps, KeyboardEvent} from 'react'
import React from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'
import {clsx} from 'clsx'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './TokenBase.module.css'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'

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

const xlargeVariantStyles = {
  fontSize: 1,
  height: tokenSizes.xlarge,
  lineHeight: tokenSizes.xlarge,
  paddingLeft: 3,
  paddingRight: 3,
  paddingTop: 0,
  paddingBottom: 0,
}

const variants = variant<
  {
    fontSize: number
    height: string
    lineHeight: string
    paddingLeft: number
    paddingRight: number
  },
  TokenSizeKeys
>({
  prop: 'size',
  variants: {
    small: {
      fontSize: 0,
      height: tokenSizes.small,
      // without setting lineHeight to match height, the "x" appears vertically mis-aligned
      lineHeight: tokenSizes.small,
      paddingLeft: 1,
      paddingRight: 1,
    },
    medium: {
      fontSize: 0,
      height: tokenSizes.medium,
      lineHeight: tokenSizes.medium,
      paddingLeft: 2,
      paddingRight: 2,
    },
    large: {
      fontSize: 0,
      height: tokenSizes.large,
      lineHeight: tokenSizes.large,
      paddingLeft: 2,
      paddingRight: 2,
    },
    xlarge: xlargeVariantStyles,
  },
})

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_team'

const StyledTokenBase = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'span',
  styled.span<
    {
      size?: TokenSizeKeys
    } & SxProp
  >`
    align-items: center;
    border-radius: 999px;
    cursor: ${props => (isTokenInteractive(props) ? 'pointer' : 'auto')};
    display: inline-flex;
    font-weight: ${get('fontWeights.bold')};
    font-family: inherit;
    text-decoration: none;
    position: relative;
    white-space: nowrap;
    ${variants}
    ${sx}
  `,
)

const TokenBase = React.forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement | undefined, TokenBaseProps>(
  ({onRemove, onKeyDown, id, className, size = defaultTokenSize, ...rest}, forwardedRef) => {
    const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

    if (enabled) {
      return (
        <StyledTokenBase
          onKeyDown={(event: KeyboardEvent<HTMLSpanElement & HTMLAnchorElement & HTMLButtonElement>) => {
            onKeyDown && onKeyDown(event)

            if ((event.key === 'Backspace' || event.key === 'Delete') && onRemove) {
              onRemove()
            }
          }}
          className={clsx(classes.TokenBase, className)}
          data-cursor-is-interactive={isTokenInteractive(rest)}
          data-size={size}
          id={id?.toString()}
          {...rest}
          ref={forwardedRef}
        />
      )
    }

    return (
      <StyledTokenBase
        onKeyDown={(event: KeyboardEvent<HTMLSpanElement & HTMLAnchorElement & HTMLButtonElement>) => {
          onKeyDown && onKeyDown(event)

          if ((event.key === 'Backspace' || event.key === 'Delete') && onRemove) {
            onRemove()
          }
        }}
        className={className}
        id={id?.toString()}
        size={size}
        {...rest}
        ref={forwardedRef}
      />
    )
  },
) as PolymorphicForwardRefComponent<'span' | 'a' | 'button', TokenBaseProps & SxProp>

export default TokenBase
