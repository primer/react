import React, {useState} from 'react'
import useDatePicker from './useDatePicker'
import {AnchoredOverlay, AnchoredOverlayProps} from '../AnchoredOverlay'
import {DatePickerPanel} from './DatePickerPanel'
import {OverlayCloseGesture} from '../AnchoredOverlay/AnchoredOverlay'

export const DatePickerOverlay: React.FC<AnchoredOverlayProps> = ({onClose, ...rest}) => {
  const {onClose: onDatePickerClose} = useDatePicker()
  const [suspendFocusTrap, setSuspendFocusTrap] = useState(false)

  const onOverlayClose = async (gesture: OverlayCloseGesture) => {
    if (!suspendFocusTrap) {
      setSuspendFocusTrap(true)
      await onDatePickerClose()
      setSuspendFocusTrap(false)
      onClose?.(gesture)
    }
  }

  return (
    <AnchoredOverlay onClose={onOverlayClose} {...rest}>
      <DatePickerPanel />
    </AnchoredOverlay>
  )
}
