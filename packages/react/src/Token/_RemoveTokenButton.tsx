import type React from 'react'
import {XIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import type {TokenSizeKeys} from './TokenBase'
import {defaultTokenSize} from './TokenBase'

import classes from './_RemoveTokenButton.module.css'

interface TokenButtonProps {
  borderOffset?: number
  size?: TokenSizeKeys
  isParentInteractive?: boolean
}

type RemoveTokenButtonProps = TokenButtonProps & Omit<React.HTMLProps<HTMLSpanElement | HTMLButtonElement>, 'size'>

const RemoveTokenButton = ({
  'aria-label': ariaLabel,
  isParentInteractive,
  size = defaultTokenSize,
  className,
  borderOffset = 0,
  as: _as,
  children: _children,
  ...rest
}: React.PropsWithChildren<RemoveTokenButtonProps & {as?: React.ElementType}>) => {
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
        <XIcon size={size === 'small' || size === 'medium' || size === 'large' ? 12 : 16} />
      </span>
    )
  }

  return (
    <button
      // eslint-disable-next-line react-hooks/refs
      {...rest}
      aria-label={'Remove token'}
      data-size={size}
      className={clsx(classes.TokenButton, className)}
      style={{
        transform: `translate(${borderOffset}px, -${borderOffset}px)`,
      }}
      // eslint-disable-next-line react-hooks/refs
      ref={rest.ref as React.Ref<HTMLButtonElement>}
      type="button"
    >
      <XIcon size={size === 'small' || size === 'medium' || size === 'large' ? 12 : 16} />
    </button>
  )
}

export default RemoveTokenButton
