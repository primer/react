import React, {useCallback} from 'react'
import {Button, ButtonDanger, ButtonPrimary} from '..'
import {Dialog, DialogButtonProps} from '../Dialog/Dialog'

export interface ConfirmationDialogProps {
  onClose: (gesture: 'close-button' | 'cancel-button' | 'escape') => void
  title: string
  cancelButtonLabel?: string
  confirmButtonLabel?: string
  confirmButtonType?: typeof Button | typeof ButtonPrimary | typeof ButtonDanger
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = props => {
  const {
    onClose,
    title,
    cancelButtonLabel = 'Cancel',
    confirmButtonLabel = 'OK',
    confirmButtonType = Button,
    children
  } = props

  const onCancelButtonClick = useCallback(() => {
    onClose('cancel-button')
  }, [onClose])
  const cancelButton: DialogButtonProps = {
    text: cancelButtonLabel,
    onClick: onCancelButtonClick
  }
  const confirmButton: DialogButtonProps = {
    text: confirmButtonLabel,
    buttonType: confirmButtonType
  }
  const footerButtons = [cancelButton, confirmButton]
  return (
    <Dialog onClose={onClose} title={title} footerButtons={footerButtons}>
      {children}
    </Dialog>
  )
}
