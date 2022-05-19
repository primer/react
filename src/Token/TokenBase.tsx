import React, {KeyboardEvent} from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'
import {get} from '../constants'
import sx, {SxProp} from '../sx'

// TODO: remove invalid "extralarge" size name in next breaking change
/** @deprecated 'extralarge' to be removed to align with size naming ADR https://github.com/github/primer/blob/main/adrs/2022-02-09-size-naming-guidelines.md **/
type ExtraLarge = 'extralarge'
export type TokenSizeKeys = 'small' | 'medium' | 'large' | 'xlarge' | ExtraLarge

const xlargeSize = '32px'

export const tokenSizes: Record<TokenSizeKeys, string> = {
  small: '16px',
  medium: '20px',
  large: '24px',
  extralarge: xlargeSize,
  xlarge: xlargeSize
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
  text: string
  /**
   * A unique identifier that can be associated with the token
   */
  id?: number | string
  /**
   * Which size the token will be rendered at
   */
  size?: TokenSizeKeys
}

type TokenElements = HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement

export const isTokenInteractive = ({
  as = 'span',
  onClick,
  onFocus,
  tabIndex = -1
}: Pick<TokenBaseProps, 'as' | 'onClick' | 'onFocus' | 'tabIndex'>) =>
  Boolean(onFocus || onClick || tabIndex > -1 || ['a', 'button'].includes(as))

const xlargeVariantStyles = {
  fontSize: 1,
  height: tokenSizes.xlarge,
  lineHeight: tokenSizes.xlarge,
  paddingLeft: 3,
  paddingRight: 3,
  paddingTop: 0,
  paddingBottom: 0
}

const variants = variant<
  {
    fontSize: number
    height: string
    lineHeight: string
    paddingLeft: number
    paddingRight: number
    paddingTop: number
    paddingBottom: number
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
      // need to explicitly set padding top and bottom to "0" to override default `<button>` element styles
      // without setting these, the "x" appears vertically mis-aligned
      paddingTop: 0,
      paddingBottom: 0
    },
    medium: {
      fontSize: 0,
      height: tokenSizes.medium,
      lineHeight: tokenSizes.medium,
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 0,
      paddingBottom: 0
    },
    large: {
      fontSize: 0,
      height: tokenSizes.large,
      lineHeight: tokenSizes.large,
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 0,
      paddingBottom: 0
    },
    extralarge: xlargeVariantStyles,
    xlarge: xlargeVariantStyles
  }
})

const StyledTokenBase = styled.span<SxProp>`
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
`

const TokenBase = React.forwardRef<TokenElements, TokenBaseProps & SxProp>(
  ({text, onRemove, onKeyDown, id, ...rest}, forwardedRef) => {
    return (
      <StyledTokenBase
        onKeyDown={(event: KeyboardEvent<TokenElements>) => {
          onKeyDown && onKeyDown(event)

          if ((event.key === 'Backspace' || event.key === 'Delete') && onRemove) {
            onRemove()
          }
        }}
        aria-label={onRemove ? `${text}, press backspace or delete to remove` : undefined}
        id={id?.toString()}
        {...rest}
        ref={forwardedRef}
      />
    )
  }
)

TokenBase.defaultProps = {
  as: 'span',
  size: defaultTokenSize
}

export default TokenBase
