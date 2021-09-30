import { KeyboardEvent } from 'react';
import styled, { css } from 'styled-components'
import { variant } from 'styled-system'
import { get } from '../constants'

export type TokenSizeKeys = 'sm' | 'md' | 'lg' | 'xl'

export const tokenSizes: Record<TokenSizeKeys, number> = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
}

export const defaultTokenSize = 'md'

export interface TokenBaseProps extends Omit<React.HTMLProps<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement>, 'size' | 'id'> {
    as?: 'button' | 'a' | 'span'
    handleRemove?: () => void
    isSelected?: boolean
    tabIndex?: number
    text: string
    id?: number | string
    variant?: TokenSizeKeys
}

export const isTokenInteractive = ({
  as = 'span',
  onClick,
  onFocus,
  tabIndex = -1
}: TokenBaseProps) => Boolean(onFocus || onClick || tabIndex > -1 || ['a', 'button'].includes(as))

const variants = variant<{fontSize: number, height: string, gap: number, paddingLeft: any, paddingRight: number}, TokenSizeKeys>({
    variants: {
      sm: {
        fontSize: 0,
        gap: 1,
        height: `${tokenSizes.sm}px`,
        paddingLeft: 1,
        paddingRight: 1,
      },
      md: {
        fontSize: 0,
        gap: 1,
        height: `${tokenSizes.md}px`,
        paddingLeft: 2,
        paddingRight: 2,
      },
      lg: {
        fontSize: 0,
        gap: 2,
        height: `${tokenSizes.lg}px`,
        paddingLeft: 2,
        paddingRight: 2,
      },
      xl: {
        fontSize: 1,
        gap: 2,
        height: `${tokenSizes.xl}px`,
        paddingLeft: 3,
        paddingRight: 3,
      }
    }
  })

const TokenBase = styled.span.attrs<TokenBaseProps>(({text, handleRemove, onKeyUp}) => ({
  onKeyUp: (e: KeyboardEvent<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement>) => {
    onKeyUp && onKeyUp(e)

    if ((e.key === 'Backspace' || e.key === 'Delete') && handleRemove) {
      handleRemove()
    }
  },
  'aria-label': handleRemove ? `${text}, press backspace or delete to remove` : undefined
}))<TokenBaseProps>`
  align-items: center;
  border-radius: 999px;
  cursor: ${props => isTokenInteractive(props) ? 'pointer' : 'auto'};
  display: inline-flex;
  font-weight: ${get('fontWeights.bold')};
  text-decoration: none;
  white-space: nowrap;
  ${variants}
`

TokenBase.defaultProps = {
  as: 'span',
  variant: defaultTokenSize,
}

export default TokenBase
