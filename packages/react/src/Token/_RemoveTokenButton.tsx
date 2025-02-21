import React from 'react'
import {XIcon} from '@primer/octicons-react'
import styled, {css} from 'styled-components'
import {variant} from 'styled-system'
import {clsx} from 'clsx'
import {get} from '../constants'
import sx, {type SxProp} from '../sx'
import type {TokenSizeKeys} from './TokenBase'
import {tokenSizes, defaultTokenSize} from './TokenBase'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'

import classes from './_RemoveTokenButton.module.css'

interface TokenButtonProps extends SxProp {
  borderOffset?: number
  size?: TokenSizeKeys
  isParentInteractive?: boolean
}

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'

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

const StyledTokenButton = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'span',
  styled.span<TokenButtonProps>`
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
  `,
)

type RemoveTokenButtonProps = TokenButtonProps & Omit<React.HTMLProps<HTMLSpanElement | HTMLButtonElement>, 'size'>

const RemoveTokenButton = ({
  'aria-label': ariaLabel,
  isParentInteractive,
  size = defaultTokenSize,
  className,
  ...rest
}: React.PropsWithChildren<RemoveTokenButtonProps>) => {
  delete rest.children

  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  return (
    <StyledTokenButton
      as={isParentInteractive ? 'span' : 'button'}
      tabIndex={isParentInteractive ? -1 : undefined}
      aria-label={!isParentInteractive ? 'Remove token' : ariaLabel}
      size={size}
      data-size={size}
      className={clsx(enabled && classes.TokenButton, className)}
      style={
        enabled
          ? {
              transform: `translate(${rest.borderOffset}px, -${rest.borderOffset}px)`,
            }
          : {}
      }
      {...rest}
    >
      <XIcon size={getTokenButtonIconSize(size)} />
    </StyledTokenButton>
  )
}

export default RemoveTokenButton
