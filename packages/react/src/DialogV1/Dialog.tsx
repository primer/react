import React, {forwardRef, useRef, type HTMLAttributes} from 'react'
import {IconButton} from '../Button'
import useDialog from '../hooks/useDialog'
import type {SxProp} from '../sx'
import type {ComponentProps} from '../utils/types'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import {XIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import classes from './Dialog.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

// Dialog v1
const noop = () => null

type StyledDialogBaseProps = {
  narrow?: boolean
  wide?: boolean
} & SxProp

export type DialogHeaderProps = React.PropsWithChildren<HTMLAttributes<HTMLDivElement>> & SxProp

function DialogHeader({children, className, ...rest}: DialogHeaderProps) {
  if (React.Children.toArray(children).every(ch => typeof ch === 'string')) {
    children = <span className={classes.HeaderChild}>{children}</span>
  }

  return (
    <BoxWithFallback as="div" {...rest} className={clsx(classes.Header, className)}>
      {children}
    </BoxWithFallback>
  )
}

type InternalDialogProps = {
  isOpen?: boolean
  onDismiss?: () => void
  initialFocusRef?: React.RefObject<HTMLElement>
  returnFocusRef?: React.RefObject<HTMLElement>
} & StyledDialogBaseProps &
  HTMLAttributes<HTMLDivElement>

const Dialog = forwardRef<HTMLDivElement, InternalDialogProps>(
  ({children, onDismiss = noop, isOpen, initialFocusRef, returnFocusRef, className, ...props}, forwardedRef) => {
    const overlayRef = useRef(null)
    const modalRef = useRef<HTMLDivElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, modalRef)
    const closeButtonRef = useRef(null)

    const onCloseClick = () => {
      onDismiss()
      if (returnFocusRef && returnFocusRef.current) {
        returnFocusRef.current.focus()
      }
    }

    const {getDialogProps} = useDialog({
      modalRef,
      onDismiss: onCloseClick,
      isOpen,
      initialFocusRef,
      closeButtonRef,
      returnFocusRef,
      overlayRef,
    })

    return isOpen ? (
      <>
        <BoxWithFallback as="span" className={classes.Overlay} ref={overlayRef} />
        <BoxWithFallback
          as="div"
          tabIndex={-1}
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          {...props}
          {...getDialogProps()}
          className={clsx(classes.Dialog, className)}
          data-width={props.wide ? 'wide' : props.narrow ? 'narrow' : 'default'}
        >
          <IconButton
            icon={XIcon}
            ref={closeButtonRef}
            onClick={onCloseClick}
            aria-label="Close"
            variant="invisible"
            className={classes.CloseIcon}
          />
          {children}
        </BoxWithFallback>
      </>
    ) : null
  },
)

DialogHeader.displayName = 'Dialog.Header'
Dialog.displayName = 'Dialog'

export type DialogProps = ComponentProps<typeof Dialog>
export default Object.assign(Dialog, {Header: DialogHeader})
