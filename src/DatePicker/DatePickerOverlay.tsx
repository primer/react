import React from 'react'
import useDatePicker from './useDatePicker'
import {AnchoredOverlay, AnchoredOverlayProps} from '../AnchoredOverlay'
import {DatePickerPanel} from './DatePickerPanel'
import {OverlayCloseGesture} from '../AnchoredOverlay/AnchoredOverlay'

export const DatePickerOverlay: React.FC<AnchoredOverlayProps> = ({onClose, ...rest}) => {
  const {revertValue} = useDatePicker()

  const onOverlayClose = (gesture: OverlayCloseGesture) => {
    revertValue()
    onClose?.(gesture)
  }

  return (
    <AnchoredOverlay onClose={onOverlayClose} {...rest}>
      <DatePickerPanel />
    </AnchoredOverlay>
  )
}
