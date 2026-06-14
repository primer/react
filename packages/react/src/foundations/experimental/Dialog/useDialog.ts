import {useCallback, useEffect, useId, useRef} from 'react'
import {useScrollLock} from '../../../hooks/useScrollLock'
import './DialogFoundation.css'

// --- Types ---

type CloseGesture = 'escape' | 'close-button' | 'backdrop'

export interface UseDialogOptions {
  /** Whether the dialog is open */
  open: boolean

  /**
   * Called when the dialog requests to close.
   * The dialog does NOT close until `open` is set to `false` — this is a request, not a command.
   */
  onClose: (gesture: CloseGesture) => void

  /** @default 'dialog' */
  role?: 'dialog' | 'alertdialog'

  /** Accessible label when no visible title is used */
  'aria-label'?: string

  /** Element to focus when the dialog opens */
  initialFocusRef?: React.RefObject<HTMLElement | null>

  /** Element to return focus to on close */
  returnFocusRef?: React.RefObject<HTMLElement | null>

  /** Whether clicking the backdrop closes the dialog. @default false */
  closeOnBackdropClick?: boolean
}

export interface UseDialogReturn {
  /** Props for the <dialog> element */
  getDialogProps: () => DialogProps
  /** Props for the title element (auto-wires aria-labelledby) */
  getTitleProps: () => TitleProps
  /** Props for the description element (auto-wires aria-describedby) */
  getDescriptionProps: () => DescriptionProps
  /** Props for the close button */
  getCloseProps: () => CloseProps
  /** Props for a scrollable body region */
  getBodyProps: () => BodyProps
  /** Whether the dialog is currently open */
  isOpen: boolean
  /** Programmatically request close */
  close: (gesture: CloseGesture) => void
}

interface DialogProps {
  ref: React.RefCallback<HTMLDialogElement>
  role: 'dialog' | 'alertdialog'
  'aria-modal': true
  'aria-labelledby'?: string
  'aria-label'?: string
  'aria-describedby'?: string
  'data-dialog-foundation': ''
  onClick: (e: React.MouseEvent) => void
}

interface TitleProps {
  id: string
}

interface DescriptionProps {
  id: string
}

interface CloseProps {
  type: 'button'
  onClick: () => void
}

interface BodyProps {
  'aria-labelledby': string
  tabIndex: 0
  role: 'region'
}

// --- Hook ---

export function useDialog(options: UseDialogOptions): UseDialogReturn {
  const {
    open,
    onClose,
    role = 'dialog',
    'aria-label': ariaLabel,
    initialFocusRef,
    returnFocusRef,
    closeOnBackdropClick = false,
  } = options

  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const previousFocusRef = useRef<Element | null>(null)
  const titleId = useId()
  const descriptionId = useId()
  // Track whether getTitleProps/getDescriptionProps are called
  const titleUsed = useRef(false)
  const descriptionUsed = useRef(false)

  // Reset usage tracking each render
  titleUsed.current = false
  descriptionUsed.current = false

  // Scroll lock
  useScrollLock(open)

  // Open/close lifecycle
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (!dialog.open) {
        // Store the element that had focus before opening
        previousFocusRef.current = document.activeElement
        dialog.showModal()
      }

      // Handle initial focus
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
      }
      // Otherwise, showModal() handles focus (autofocus attribute or first focusable)
    } else {
      if (dialog.open) {
        dialog.close()
      }

      // Restore focus
      const returnTarget = returnFocusRef?.current ?? previousFocusRef.current
      if (returnTarget instanceof HTMLElement) {
        returnTarget.focus()
      }
      previousFocusRef.current = null
    }
  }, [open, initialFocusRef, returnFocusRef])

  // Intercept native cancel event (Escape key) — controlled close contract
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleCancel = (e: Event) => {
      e.preventDefault()
      onClose('escape')
    }

    // Guard: if native close happens without going through onClose
    // (e.g. dialog.close() called directly), re-sync state.
    const handleClose = () => {
      if (open && !dialog.open) {
        // Native dialog was closed externally — re-open to maintain controlled contract
        dialog.showModal()
      }
    }

    dialog.addEventListener('cancel', handleCancel)
    dialog.addEventListener('close', handleClose)
    return () => {
      dialog.removeEventListener('cancel', handleCancel)
      dialog.removeEventListener('close', handleClose)
    }
  }, [onClose, open])

  // Backdrop click detection
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!closeOnBackdropClick) return

      // Native <dialog> fires click on the dialog element when backdrop is clicked.
      // We detect backdrop clicks by checking if the click was on the dialog itself
      // (not a child) — the backdrop area is the padding/border area of the <dialog>.
      const dialog = dialogRef.current
      if (!dialog || e.target !== dialog) return

      // Check if click was outside the dialog's content box
      const rect = dialog.getBoundingClientRect()
      const clickedInside =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom

      if (!clickedInside) {
        onClose('backdrop')
      }
    },
    [closeOnBackdropClick, onClose],
  )

  const close = useCallback(
    (gesture: CloseGesture) => {
      onClose(gesture)
    },
    [onClose],
  )

  // Dev-mode accessible name check
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && open) {
      // Check after a microtask so getTitleProps has been called
      queueMicrotask(() => {
        if (!titleUsed.current && !ariaLabel) {
          console.warn(
            'Dialog: No accessible name provided. Use getTitleProps() on a title element, or pass aria-label to useDialog().',
          )
        }
      })
    }
  }, [open, ariaLabel])

  // Ref callback for the dialog element
  const refCallback = useCallback((node: HTMLDialogElement | null) => {
    dialogRef.current = node
  }, [])

  // --- Prop getters ---

  const getDialogProps = useCallback((): DialogProps => {
    const props: DialogProps = {
      ref: refCallback,
      role,
      'aria-modal': true,
      'data-dialog-foundation': '',
      onClick: handleClick,
    }

    // Accessible name: prefer aria-labelledby (set if getTitleProps is used)
    // Fall back to aria-label
    if (ariaLabel) {
      props['aria-label'] = ariaLabel
    }
    // aria-labelledby and aria-describedby are always set —
    // they reference IDs that may or may not exist in the DOM.
    // If the element with that ID doesn't exist, the attribute is silently ignored.
    props['aria-labelledby'] = titleId
    props['aria-describedby'] = descriptionId

    return props
  }, [refCallback, role, ariaLabel, titleId, descriptionId, handleClick])

  const getTitleProps = useCallback((): TitleProps => {
    titleUsed.current = true
    return {id: titleId}
  }, [titleId])

  const getDescriptionProps = useCallback((): DescriptionProps => {
    descriptionUsed.current = true
    return {id: descriptionId}
  }, [descriptionId])

  const getCloseProps = useCallback((): CloseProps => {
    return {
      type: 'button',
      onClick: () => onClose('close-button'),
    }
  }, [onClose])

  const getBodyProps = useCallback((): BodyProps => {
    return {
      'aria-labelledby': titleId,
      tabIndex: 0,
      role: 'region',
    }
  }, [titleId])

  return {
    getDialogProps,
    getTitleProps,
    getDescriptionProps,
    getCloseProps,
    getBodyProps,
    isOpen: open,
    close,
  }
}
