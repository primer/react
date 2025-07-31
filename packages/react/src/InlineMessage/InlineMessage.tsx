import {AlertFillIcon, AlertIcon, CheckCircleFillIcon, CheckCircleIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import type React from 'react'
import classes from './InlineMessage.module.css'
import type {SxProp} from '../sx'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'
type MessageVariant = 'critical' | 'success' | 'unavailable' | 'warning'

export type InlineMessageProps = React.ComponentPropsWithoutRef<'div'> &
  SxProp & {
    /**
     * Specify the size of the InlineMessage
     */
    size?: 'small' | 'medium'

    /**
     * Specify the type of the InlineMessage
     */
    variant: MessageVariant
  }

const variantToIcon = (variant: MessageVariant): React.ReactNode => {
  const icons = {
    warning: <AlertIcon className={classes.InlineMessageIcon} />,
    critical: <AlertIcon className={classes.InlineMessageIcon} />,
    success: <CheckCircleIcon className={classes.InlineMessageIcon} />,
    unavailable: <AlertIcon className={classes.InlineMessageIcon} />,
  }

  return icons[variant]
}

const variantToSmallIcon = (variant: MessageVariant): React.ReactNode => {
  const icons = {
    warning: <AlertFillIcon className={classes.InlineMessageIcon} size={12} />,
    critical: <AlertFillIcon className={classes.InlineMessageIcon} size={12} />,
    success: <CheckCircleFillIcon className={classes.InlineMessageIcon} size={12} />,
    unavailable: <AlertFillIcon className={classes.InlineMessageIcon} size={12} />,
  }
  return icons[variant]
}

export function InlineMessage({children, className, size = 'medium', variant, ...rest}: InlineMessageProps) {
  const icon = size === 'small' ? variantToSmallIcon(variant) : variantToIcon(variant)

  return (
    <BoxWithFallback
      className={clsx(className, classes.InlineMessage)}
      {...rest}
      data-size={size}
      data-variant={variant}
    >
      {icon}
      {children}
    </BoxWithFallback>
  )
}
