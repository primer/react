import React from 'react'
import {OverlayProps} from '../Overlay'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {FocusTrapHookSettings} from '../hooks/useFocusTrap'
import {FocusZoneHookSettings} from '../hooks/useFocusZone'

export interface DatePickerProps {
  anchorVariant: 'full' | 'iconOnly'
  /**
   * Settings to apply to the Focus Zone on the internal `Overlay` component.
   */
  focusTrapSettings?: Partial<FocusTrapHookSettings>

  /**
   * Settings to apply to the Focus Zone on the internal `Overlay` component.
   */
  focusZoneSettings?: Partial<FocusZoneHookSettings>
  initialValue?: 'today' | Date | string | null
  placeholder?: string
  /**
   * Determines whether the overlay portion of the component should be shown or not
   */
  open: boolean

  /**
   * A callback which is called whenever the overlay is currently closed and an "open gesture" is detected.
   */
  onOpen?: (gesture: 'anchor-click' | 'anchor-key-press') => unknown

  /**
   * A callback which is called whenever the overlay is currently open and a "close gesture" is detected.
   */
  onClose?: (gesture: 'anchor-click' | 'click-outside' | 'escape') => unknown

  /**
   * Props to be spread on the internal `Overlay` component.
   */
  overlayProps?: Partial<OverlayProps>

  value?: Date | string | null
}

export const DatePicker: React.FC<DatePickerProps> = ({
  focusTrapSettings,
  focusZoneSettings,
  initialValue,
  onOpen,
  onClose,
  open,
  overlayProps,
  value
}) => {
  return (
    <AnchoredOverlay
      renderAnchor={renderMenuAnchor}
      anchorRef={anchorRef}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      overlayProps={overlayProps}
      focusTrapSettings={focusTrapSettings}
      focusZoneSettings={focusZoneSettings}
    >
      {value}
    </AnchoredOverlay>
  )
}
