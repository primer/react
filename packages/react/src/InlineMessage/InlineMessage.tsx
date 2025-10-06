import {AlertFillIcon, AlertIcon, CheckCircleFillIcon, CheckCircleIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import type React from 'react'
import classes from './InlineMessage.module.css'
type MessageVariant = 'critical' | 'success' | 'unavailable' | 'warning'

export type InlineMessageProps = React.ComponentPropsWithoutRef<'div'> & {
  /**
   * Specify the size of the InlineMessage
   */
  size?: 'small' | 'medium'

  /**
   * Specify the type of the InlineMessage
   */
  variant: MessageVariant
}

const icons: Record<MessageVariant, React.ReactNode> = {
  warning: <AlertIcon className={classes.InlineMessageIcon} />,
  critical: <AlertIcon className={classes.InlineMessageIcon} />,
  success: <CheckCircleIcon className={classes.InlineMessageIcon} />,
  unavailable: <AlertIcon className={classes.InlineMessageIcon} />,
}

const smallIcons: Record<MessageVariant, React.ReactNode> = {
  warning: <AlertFillIcon className={classes.InlineMessageIcon} size={12} />,
  critical: <AlertFillIcon className={classes.InlineMessageIcon} size={12} />,
  success: <CheckCircleFillIcon className={classes.InlineMessageIcon} size={12} />,
  unavailable: <AlertFillIcon className={classes.InlineMessageIcon} size={12} />,
}

export function InlineMessage({children, className, size = 'medium', variant, ...rest}: InlineMessageProps) {
  const icon = size === 'small' ? smallIcons[variant] : icons[variant]

  return (
    <div {...rest} className={clsx(className, classes.InlineMessage)} data-size={size} data-variant={variant}>
      {icon}
      {children}
    </div>
  )
}
