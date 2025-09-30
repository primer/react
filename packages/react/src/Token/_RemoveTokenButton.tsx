import type React from 'react'
import {XIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import type {TokenSizeKeys} from './TokenBase'
import {tokenSizes, defaultTokenSize} from './TokenBase'

import classes from './_RemoveTokenButton.module.css'

interface TokenButtonProps {
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
  if (isParentInteractive) {
    return (
      <span
        {...rest}
        tabIndex={-1}
        aria-label={ariaLabel}
        data-size={size}
        className={clsx(classes.TokenButton, className)}
        style={{
          transform: `translate(${borderOffset}px, -${borderOffset}px)`,
        }}
      >
        <XIcon size={getTokenButtonIconSize(size)} />
      </span>
    )
  }

  return (
    <button
      {...rest}
      aria-label={'Remove token'}
      data-size={size}
      className={clsx(classes.TokenButton, className)}
      style={{
        transform: `translate(${borderOffset}px, -${borderOffset}px)`,
      }}
      ref={rest.ref as React.Ref<HTMLButtonElement>}
      type="button"
    >
      <XIcon size={getTokenButtonIconSize(size)} />
    </button>
  )
}

export default RemoveTokenButton
