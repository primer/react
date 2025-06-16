import type React from 'react'
import {XIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import {type SxProp} from '../sx'
import type {TokenSizeKeys} from './TokenBase'
import {tokenSizes, defaultTokenSize} from './TokenBase'

import classes from './_RemoveTokenButton.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

interface TokenButtonProps extends SxProp {
  borderOffset?: number
  size?: TokenSizeKeys
  isParentInteractive?: boolean
}

const getTokenButtonIconSize = (size?: TokenSizeKeys) => parseInt(tokenSizes[size || defaultTokenSize], 10) * 0.75

type RemoveTokenButtonProps = TokenButtonProps & Omit<React.HTMLProps<HTMLSpanElement | HTMLButtonElement>, 'size'>

const RemoveTokenButton = ({
  'aria-label': ariaLabel,
  isParentInteractive,
  size = defaultTokenSize,
  className,
  borderOffset = 0,
  as: _as,
  ...rest
}: React.PropsWithChildren<RemoveTokenButtonProps & {as?: React.ElementType}>) => {
  // eslint-disable-next-line react-compiler/react-compiler
  delete rest.children
  return (
    <BoxWithFallback
      as={isParentInteractive ? 'span' : 'button'}
      tabIndex={isParentInteractive ? -1 : undefined}
      aria-label={!isParentInteractive ? 'Remove token' : ariaLabel}
      data-size={size}
      className={clsx(classes.TokenButton, className)}
      style={{
        transform: `translate(${borderOffset}px, -${borderOffset}px)`,
      }}
      {...rest}
    >
      <XIcon size={getTokenButtonIconSize(size)} />
    </BoxWithFallback>
  )
}

export default RemoveTokenButton
