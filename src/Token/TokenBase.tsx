import {KeyboardEvent} from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'
import {get} from '../constants'
import sx, {SxProp} from '../sx'

export type TokenSizeKeys = 'small' | 'medium' | 'large' | 'xlarge'

export const tokenSizes: Record<TokenSizeKeys, string> = {
  small: '16px',
  medium: '20px',
  large: '24px',
  xlarge: '32px'
}

export const defaultTokenSize: TokenSizeKeys = 'medium'

export interface TokenBaseProps
  extends Omit<React.HTMLProps<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement>, 'size' | 'id'> {
  as?: 'button' | 'a' | 'span'
  onRemove?: () => void
  isSelected?: boolean
  tabIndex?: number
  text: string
  id?: number | string
  size?: TokenSizeKeys
}

export const isTokenInteractive = ({as = 'span', onClick, onFocus, tabIndex = -1}: TokenBaseProps) =>
  Boolean(onFocus || onClick || tabIndex > -1 || ['a', 'button'].includes(as))

const variants = variant<
  {
    fontSize: number
    height: string
    lineHeight: string
    gap: number
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
      gap: 1,
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
      gap: 1,
      height: tokenSizes.medium,
      lineHeight: tokenSizes.medium,
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 0,
      paddingBottom: 0
    },
    large: {
      fontSize: 0,
      gap: 2,
      height: tokenSizes.large,
      lineHeight: tokenSizes.large,
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 0,
      paddingBottom: 0
    },
    xlarge: {
      fontSize: 1,
      gap: 2,
      height: tokenSizes.xlarge,
      lineHeight: tokenSizes.xlarge,
      paddingLeft: 3,
      paddingRight: 3,
      paddingTop: 0,
      paddingBottom: 0
    }
  }
})

const TokenBase = styled.span.attrs<TokenBaseProps>(({text, onRemove, onKeyDown}) => ({
  onKeyDown: (event: KeyboardEvent<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement>) => {
    onKeyDown && onKeyDown(event)

    if ((event.key === 'Backspace' || event.key === 'Delete') && onRemove) {
      onRemove()
    }
  },
  'aria-label': onRemove ? `${text}, press backspace or delete to remove` : undefined
}))<TokenBaseProps & SxProp>`
  align-items: center;
  border-radius: 999px;
  cursor: ${props => (isTokenInteractive(props) ? 'pointer' : 'auto')};
  display: inline-flex;
  font-weight: ${get('fontWeights.bold')};
  text-decoration: none;
  white-space: nowrap;
  ${variants}
  ${sx}
`

TokenBase.defaultProps = {
  as: 'span',
  size: defaultTokenSize
}

export default TokenBase
