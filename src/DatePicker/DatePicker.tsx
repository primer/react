import React, {useRef, useState} from 'react'
import {OverlayProps} from '../Overlay'
import {FocusTrapHookSettings} from '../hooks/useFocusTrap'
import {FocusZoneHookSettings} from '../hooks/useFocusZone'
import {DatePickerAnchor} from './DatePickerAnchor'
import {DatePickerConfiguration, DatePickerProvider, Selection} from './useDatePicker'
import {DatePickerOverlay} from './DatePickerOverlay'

type OpenGesture = 'anchor-click' | 'anchor-key-press'
type CloseGesture = 'anchor-click' | 'click-outside' | 'escape'

export interface DatePickerProps extends DatePickerConfiguration {
  /**
   * An override to the internal ref that will be spread on to the renderAnchor
   */
  anchorRef?: React.RefObject<HTMLElement>
  /**
   * Settings to apply to the Focus Zone on the internal `Overlay` component.
   */
  focusTrapSettings?: Partial<FocusTrapHookSettings>

  /**
   * Settings to apply to the Focus Zone on the internal `Overlay` component.
   */
  focusZoneSettings?: Partial<FocusZoneHookSettings>
  initialValue?: 'today' | Date | string | null
  iconOnly?: boolean
  placeholder?: string
  /**
   * Determines whether the overlay portion of the component should be shown or not
   */
  open?: boolean

  /**
   * A callback which is called whenever the overlay is currently closed and an "open gesture" is detected.
   */
  onOpen?: (gesture: OpenGesture) => unknown

  /**
   * A callback which is called whenever the overlay is currently open and a "close gesture" is detected.
   */
  onClose?: (gesture: CloseGesture) => unknown

  /**
   * Props to be spread on the internal `Overlay` component.
   */
  overlayProps?: Partial<OverlayProps>
  /**
   * A custom function component used to render the anchor element.
   * Will receive the selected text as `children` prop when an item is activated.
   */
  renderAnchor: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element

  value?: Selection
}

export const DatePicker: React.FC<DatePickerProps> = ({
  anchorVariant,
  anchorRef: externalAnchorRef,
  focusTrapSettings,
  focusZoneSettings,
  onOpen: onOpenExternal,
  onClose: onCloseExternal,
  open,
  overlayProps,
  renderAnchor,
  selection,
  value,
  view
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const datePickerConfiguration: DatePickerConfiguration = {
    anchorVariant,
    selection,
    view
  }

  const onOpen = (gesture: OpenGesture) => {
    setIsOpen(true)
    onOpenExternal?.(gesture)
  }

  const onClose = (gesture: CloseGesture) => {
    setIsOpen(false)
    onCloseExternal?.(gesture)
  }

  const toggleIsOpen = () => {
    if (isOpen) {
      setIsOpen(false)
      onCloseExternal?.('anchor-click')
    } else {
      setIsOpen(true)
      onCloseExternal?.('anchor-click')
    }
  }

  return (
    <DatePickerProvider configuration={datePickerConfiguration} value={value} closePicker={() => setIsOpen(false)}>
      <DatePickerAnchor ref={buttonRef} onAction={toggleIsOpen} />
      <DatePickerOverlay
        anchorRef={externalAnchorRef ?? buttonRef}
        renderAnchor={renderAnchor}
        open={open ?? isOpen}
        onOpen={onOpen}
        onClose={onClose}
        overlayProps={overlayProps}
        focusTrapSettings={focusTrapSettings}
        focusZoneSettings={focusZoneSettings}
      />
    </DatePickerProvider>
  )
}
