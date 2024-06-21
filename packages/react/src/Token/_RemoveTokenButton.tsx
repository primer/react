import React from 'react'
import {XIcon} from '@primer/octicons-react'
import styled, {css} from 'styled-components'
import {variant} from 'styled-system'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import type {TokenSizeKeys} from './TokenBase'
import {tokenSizes, defaultTokenSize} from './TokenBase'

interface TokenButtonProps {
  borderOffset?: number
  size?: TokenSizeKeys
  isParentInteractive?: boolean
}

const variants = variant<{height: string; width: string}, TokenSizeKeys>({
  prop: 'size',
  variants: {
    small: {
      height: tokenSizes.small,
      width: tokenSizes.small,
    },
    medium: {
      height: tokenSizes.medium,
      width: tokenSizes.medium,
    },
    large: {
      height: tokenSizes.large,
      width: tokenSizes.large,
    },
    xlarge: {
      height: tokenSizes.xlarge,
      width: tokenSizes.xlarge,
    },
  },
})

const getTokenButtonIconSize = (size?: TokenSizeKeys) => parseInt(tokenSizes[size || defaultTokenSize], 10) * 0.75

const StyledTokenButton = styled.span<TokenButtonProps & SxProp>`
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
  transform: ${props => `translate(${props.borderOffset}px, -${props.borderOffset}px)`};
  align-self: baseline;
  border: 0;
  border-radius: 999px;

  ${props => {
    switch (props.size) {
      case 'large':
      case 'xlarge':
        return css`
          margin-left: ${get('space.2')};
        `
      default:
        return css`
          margin-left: ${get('space.1')};
        `
    }
  }}

  &:hover,
  &:focus {
    // TODO: choose a better functional color variable for this
    background-color: ${get('colors.neutral.muted')};
  }

  &:active {
    // TODO: choose a better functional color variable for this
    background-color: ${get('colors.neutral.subtle')};
  }

  ${variants}
  ${sx}
`

const RemoveTokenButton: React.FC<React.PropsWithChildren<ComponentProps<typeof StyledTokenButton>>> = ({
  'aria-label': ariaLabel,
  isParentInteractive,
  size = defaultTokenSize,
  ...rest
}) => {
  delete rest.children

  return (
    <StyledTokenButton
      as={isParentInteractive ? 'span' : 'button'}
      tabIndex={isParentInteractive ? -1 : undefined}
      aria-label={!isParentInteractive ? 'Remove token' : ariaLabel}
      size={size}
      {...rest}
    >
      <XIcon size={getTokenButtonIconSize(size)} />
    </StyledTokenButton>
  )
}

export default RemoveTokenButton
