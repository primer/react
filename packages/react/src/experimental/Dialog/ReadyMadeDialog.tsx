import React, {useCallback, useRef} from 'react'
import type {ButtonProps} from '../../Button'
import {Button} from '../../Button'
import type {ResponsiveValue} from '../../hooks/useResponsiveValue'
import {Dialog as DialogParts} from './Dialog'

// --- Types ---

export type DialogButtonProps = Omit<ButtonProps, 'content'> & {
  /** The variant of button to render */
  buttonType?: 'default' | 'primary' | 'danger'
  /** The button label */
  content: React.ReactNode
  /**
   * If true, focus this button when the dialog opens.
   * Only the first button with autoFocus will receive focus.
   */
  autoFocus?: boolean
}

export interface ReadyMadeDialogProps {
  /** Whether the dialog is open */
  open: boolean

  /** Title displayed in the dialog header */
  title: React.ReactNode

  /** Subtitle displayed below the title */
  subtitle?: React.ReactNode

  /**
   * Called when the dialog requests to close.
   * The dialog does NOT close until `open` is set to `false`.
   */
  onClose: (gesture: 'escape' | 'close-button' | 'backdrop') => void

  /** @default 'dialog' */
  role?: 'dialog' | 'alertdialog'

  /** The width of the dialog content area */
  width?: 'small' | 'medium' | 'large' | 'xlarge'

  /** The height of the dialog content area */
  height?: 'small' | 'large' | 'auto'

  /** The position of the dialog */
  position?: 'center' | 'left' | 'right' | ResponsiveValue<'left' | 'right' | 'bottom' | 'fullscreen' | 'center'>

  /** Vertical alignment when position is center */
  align?: 'top' | 'center' | 'bottom'

  /** Buttons rendered in the dialog footer */
  footerButtons?: DialogButtonProps[]

  /** Dialog body content */
  children: React.ReactNode

  /** Additional class name for the root dialog element */
  className?: string

  /** Element to return focus to on close */
  returnFocusRef?: React.RefObject<HTMLElement | null>

  /** Whether clicking the backdrop closes the dialog. @default false */
  closeOnBackdropClick?: boolean
}

// --- Component ---

const buttonTypeToVariant: Record<string, ButtonProps['variant']> = {
  default: 'default',
  primary: 'primary',
  danger: 'danger',
}

export const ReadyMadeDialog = React.forwardRef<HTMLDialogElement, ReadyMadeDialogProps>(function ReadyMadeDialog(
  {
    open,
    title,
    subtitle,
    onClose,
    role,
    width,
    height,
    position,
    align,
    footerButtons,
    children,
    className,
    returnFocusRef,
    closeOnBackdropClick,
  },
  ref,
) {
  // Find the first button with autoFocus to use as initialFocusRef
  const autoFocusButtonRef = useRef<HTMLButtonElement>(null)
  const autoFocusIndex = footerButtons?.findIndex(b => b.autoFocus) ?? -1

  const onCloseHandler = useCallback(
    (gesture: 'escape' | 'close-button' | 'backdrop') => {
      onClose(gesture)
    },
    [onClose],
  )

  return (
    <DialogParts
      ref={ref}
      open={open}
      onClose={onCloseHandler}
      role={role}
      className={className}
      returnFocusRef={returnFocusRef}
      closeOnBackdropClick={closeOnBackdropClick}
      initialFocusRef={autoFocusIndex >= 0 ? autoFocusButtonRef : undefined}
    >
      <DialogParts.Content width={width} height={height} position={position} align={align}>
        <DialogParts.Header>
          <DialogParts.Title>{title}</DialogParts.Title>
          <DialogParts.CloseButton />
        </DialogParts.Header>
        {subtitle && <DialogParts.Subtitle>{subtitle}</DialogParts.Subtitle>}
        <DialogParts.Body>{children}</DialogParts.Body>
        {footerButtons && footerButtons.length > 0 && (
          <DialogParts.Footer>
            {footerButtons.map(({buttonType = 'default', content, autoFocus: _autoFocus, ...buttonProps}, index) => (
              <Button
                key={index}
                variant={buttonTypeToVariant[buttonType]}
                ref={index === autoFocusIndex ? autoFocusButtonRef : undefined}
                {...buttonProps}
              >
                {content}
              </Button>
            ))}
          </DialogParts.Footer>
        )}
      </DialogParts.Content>
    </DialogParts>
  )
})

ReadyMadeDialog.displayName = 'ReadyMadeDialog'
