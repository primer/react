import React, {useEffect, useRef, useState} from 'react'
import {DatePickerAnchor} from './DatePickerAnchor'
import {DatePickerProvider} from './DatePickerProvider'
import {DatePickerOverlay} from './DatePickerOverlay'
import {AnchoredOverlayProps} from '../AnchoredOverlay'
import {DatePickerConfiguration, Selection} from './types'

type OpenGesture = 'anchor-click' | 'anchor-key-press'
type CloseGesture = 'anchor-click' | 'click-outside' | 'escape'

export interface DatePickerProps extends DatePickerConfiguration {
  /**
   * Props to be spread on the internal `AnchoredOverlay` component.
   */
  anchoredOverlayProps?: Partial<AnchoredOverlayProps>
  /**
   * An override to the internal ref that will be spread on to the renderAnchor
   */
  anchorRef?: React.RefObject<HTMLElement>

  /**
   * Date Picker configuration object
   */
  configuration?: DatePickerConfiguration

  /**
   * Determines whether the overlay portion of the component should be shown or not
   */
  open?: boolean

  /**
   * A callback which is called whenever the overlay is currently closed and an "open gesture" is detected.
   */
  onChange?: (value?: Selection) => void

  /**
   * A callback which is called whenever the overlay is currently open and a "close gesture" is detected.
   */
  onClose?: (gesture: CloseGesture) => void

  /**
   * A callback which is called whenever the overlay is currently closed and an "open gesture" is detected.
   */
  onOpen?: (gesture: OpenGesture) => void

  /**
   * Placeholder string when there is no selection
   */
  placeholder?: string

  /**
   * A custom function component used to render the anchor element.
   * Will receive the selected text as `children` prop when an item is activated.
   */
  renderAnchor?: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element

  /**
   * Value for the Date Picker
   */
  value?: Selection
}

export const DatePicker: React.FC<DatePickerProps> = ({
  anchoredOverlayProps,
  anchorVariant,
  anchorRef: externalAnchorRef,
  configuration: externalConfiguration,
  confirmation,
  confirmUnsavedClose,
  compressedHeader,
  dateFormat,
  disableWeekends,
  iconPlacement,
  maxDate,
  maxRangeSize,
  maxSelections,
  minDate,
  onClose: onCloseExternal,
  onOpen: onOpenExternal,
  onChange,
  open,
  placeholder,
  showInputPrompt,
  value,
  variant,
  view,
  weekStartsOn
}) => {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(open ?? false)
  const suppliedAnchorRef = externalAnchorRef ?? anchoredOverlayProps?.anchorRef

  const configuration: DatePickerConfiguration = {
    anchorVariant,
    confirmation,
    confirmUnsavedClose,
    compressedHeader,
    dateFormat,
    disableWeekends,
    iconPlacement,
    maxDate,
    maxRangeSize,
    maxSelections,
    minDate,
    placeholder,
    showInputPrompt,
    variant,
    view,
    weekStartsOn,
    ...externalConfiguration
  }

  // For external control
  useEffect(() => {
    if (open !== undefined) setIsOpen(open)
  }, [open])

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
    <DatePickerProvider
      closePicker={() => setIsOpen(false)}
      configuration={configuration}
      isOpen={isOpen}
      onChange={onChange}
      value={value}
    >
      {!suppliedAnchorRef && <DatePickerAnchor ref={anchorRef} onAction={toggleIsOpen} />}
      <DatePickerOverlay
        {...anchoredOverlayProps}
        anchorRef={suppliedAnchorRef ?? anchorRef}
        renderAnchor={anchoredOverlayProps?.renderAnchor ?? null}
        open={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
    </DatePickerProvider>
  )
}
