import React from 'react'
import useDatePicker from './useDatePicker'
import {AnchoredOverlay, AnchoredOverlayProps} from '../AnchoredOverlay'
import {DatePickerPanel} from './DatePickerPanel'
import {OverlayCloseGesture} from '../AnchoredOverlay/AnchoredOverlay'

export const DatePickerOverlay: React.FC<AnchoredOverlayProps> = ({onClose, ...rest}) => {
  const {dialogOpen, onClose: onDatePickerClose, setDialogOpen, currentViewingDate} = useDatePicker()

  const onOverlayClose = async (gesture: OverlayCloseGesture) => {
    if (!dialogOpen) {
      setDialogOpen(true)
      await onDatePickerClose()
      setDialogOpen(false)
      onClose?.(gesture)
    }
  }

  return (
    <AnchoredOverlay
      onClose={onOverlayClose}
      {...rest}
      aria-modal="true"
      aria-labelledby={`${currentViewingDate.getMonth()} ${currentViewingDate.getFullYear()}`}
      aria-live="polite"
    >
      <DatePickerPanel />
    </AnchoredOverlay>
  )
}
