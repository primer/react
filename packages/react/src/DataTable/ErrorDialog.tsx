import type React from 'react'
import {ConfirmationDialog} from '../ConfirmationDialog/ConfirmationDialog'

export type TableErrorDialogProps = React.PropsWithChildren<{
  /**
   * Provide an optional title for the dialog
   * @default 'Error'
   */
  title?: string

  /**
   * Provide an optional handler to be called when the user confirms to retry
   */
  onRetry?: () => void

  /**
   * Provide an optional handler to be called when the user dismisses the dialog
   */
  onDismiss?: () => void
}>

export function ErrorDialog({title = 'Error', children, onRetry, onDismiss}: TableErrorDialogProps) {
  return (
    <ConfirmationDialog
      title={title}
      onClose={gesture => {
        if (gesture === 'confirm') {
          onRetry?.()
        } else {
          onDismiss?.()
        }
      }}
      confirmButtonContent="Retry"
      cancelButtonContent="Dismiss"
    >
      {children}
    </ConfirmationDialog>
  )
}
