import {XIcon} from '@primer/octicons-react'
import styled, {css} from 'styled-components'
import {variant} from 'styled-system'
import {get} from '../constants'
import {tokenSizes, TokenSizeKeys, defaultTokenSize} from './TokenBase'

interface TokenButtonProps {
  borderOffset?: number
  parentTokenTag: 'span' | 'button' | 'a'
  size?: TokenSizeKeys
  isParentInteractive?: boolean
}

const variants = variant({
  prop: 'size',
  variants: {
    sm: {
      height: tokenSizes.sm,
      width: tokenSizes.sm
    },
    md: {
      height: tokenSizes.md,
      width: tokenSizes.md
    },
    lg: {
      height: tokenSizes.lg,
      width: tokenSizes.lg
    },
    xl: {
      height: tokenSizes.xl,
      width: tokenSizes.xl
    }
  }
})

const tokenButtonStyles = css`
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

const getTokenButtonIconSize = (variant?: TokenSizeKeys) => parseInt(tokenSizes[variant || defaultTokenSize], 10) * 0.75

const RemoveTokenButton = styled.span.attrs<TokenButtonProps>(
  ({borderOffset, parentTokenTag, size, isParentInteractive, ...rest}) => {
    delete rest.children

    return {
      borderOffset,
      as: isParentInteractive ? 'span' : 'button',
      tabIndex: isParentInteractive ? -1 : undefined,
      'aria-label': !isParentInteractive ? 'Remove token' : undefined,
      children: <XIcon size={getTokenButtonIconSize(size)} />
    }
  }
)<TokenButtonProps>`
  ${tokenButtonStyles}
  ${variants}
    transform: ${props => `translate(${props.borderOffset}px, -${props.borderOffset}px)`};
`

RemoveTokenButton.defaultProps = {
  size: defaultTokenSize
}

export default RemoveTokenButton
