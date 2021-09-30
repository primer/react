import { css } from 'styled-components'
import { variant } from 'styled-system'
import { get } from '../constants'
import { tokenSizes, TokenSizeKeys, defaultTokenSize } from "./TokenBase"

export interface TokenButtonProps {
    borderOffset?: number
    parentTokenTag: 'span' | 'button' | 'a'
    variant?: TokenSizeKeys
    parentTokenIsInteractive?: boolean
}

export const variants = variant({
    variants: {
      sm: {
        height: `${tokenSizes.sm}px`,
        width: `${tokenSizes.sm}px`,
      },
      md: {
        height: `${tokenSizes.md}px`,
        width: `${tokenSizes.md}px`,
      },
      lg: {
        height: `${tokenSizes.lg}px`,
        width: `${tokenSizes.lg}px`,
      },
      xl: {
        height: `${tokenSizes.xl}px`,
        width: `${tokenSizes.xl}px`,
      }
    }
  })

export const tokenButtonStyles = css`
    background-color: transparent;
    font-family: inherit;
    color: currentColor;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    appearance: none;
    text-decoration: none;
    padding: 0;

    align-self: baseline;
    border: 0;
    border-radius: 999px;

    &:hover,
    &:focus {
        background-color: ${get('colors.fade.fg10')};
    }

    &:active {
        background-color: ${get('colors.fade.fg15')};
    }
`

export const getTokenButtonIconSize = (variant?: TokenSizeKeys) => tokenSizes[variant || defaultTokenSize] * 0.75
