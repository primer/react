import React, {forwardRef, useRef} from 'react'
import styled from 'styled-components'
import {IconButton} from './Button'
import {get} from './constants'
import Box from './Box'
import useDialog from './hooks/useDialog'
import type {SxProp} from './sx'
import sx from './sx'
import Text from './Text'
import type {ComponentProps} from './utils/types'
import {useRefObjectAsForwardedRef} from './hooks/useRefObjectAsForwardedRef'
import {XIcon} from '@primer/octicons-react'

// Dialog v1
const noop = () => null

type StyledDialogBaseProps = {
  narrow?: boolean
  wide?: boolean
} & SxProp

const DialogBase = styled.div<StyledDialogBaseProps>`
  box-shadow: ${get('shadows.shadow.large')};
  border-radius: ${get('radii.2')};
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-height: 80vh;
  z-index: 999;
  margin: 10vh auto;
  background-color: ${get('colors.canvas.default')};
  width: ${props => (props.narrow ? '320px' : props.wide ? '640px' : '440px')};
  outline: none;

  @media screen and (max-width: 750px) {
    width: 100dvw;
    margin: 0;
    border-radius: 0;
    height: 100dvh;
  }

  ${sx};
`

const DialogHeaderBase = styled(Box)<SxProp>`
  border-radius: ${get('radii.2')} ${get('radii.2')} 0px 0px;
  border-bottom: 1px solid ${get('colors.border.default')};
  display: flex;

  @media screen and (max-width: 750px) {
    border-radius: 0px;
  }

  ${sx};
`
export type DialogHeaderProps = ComponentProps<typeof DialogHeaderBase>

function DialogHeader({theme, children, backgroundColor = 'canvas.subtle', ...rest}: DialogHeaderProps) {
  if (React.Children.toArray(children).every(ch => typeof ch === 'string')) {
    children = (
      <Text fontSize={1} fontWeight="bold">
        {children}
      </Text>
    )
  }

  return (
    <DialogHeaderBase theme={theme} p={3} backgroundColor={backgroundColor} {...rest}>
      {children}
    </DialogHeaderBase>
  )
}

const Overlay = styled.span`
  &:before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    cursor: default;
    content: ' ';
    background: transparent;
    z-index: 99;
    background: ${get('colors.primer.canvas.backdrop')};
  }
`

type InternalDialogProps = {
  isOpen?: boolean
  onDismiss?: () => void
  initialFocusRef?: React.RefObject<HTMLElement>
  returnFocusRef?: React.RefObject<HTMLElement>
} & ComponentProps<typeof DialogBase>

const Dialog = forwardRef<HTMLDivElement, InternalDialogProps>(
  ({children, onDismiss = noop, isOpen, initialFocusRef, returnFocusRef, ...props}, forwardedRef) => {
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
        <Overlay ref={overlayRef} />
        <DialogBase tabIndex={-1} ref={modalRef} role="dialog" aria-modal="true" {...props} {...getDialogProps()}>
          <IconButton
            icon={XIcon}
            ref={closeButtonRef}
            onClick={onCloseClick}
            sx={{position: 'absolute', top: '8px', right: '16px'}}
            aria-label="Close"
            variant="invisible"
          />
          {children}
        </DialogBase>
      </>
    ) : null
  },
)

DialogHeader.propTypes = {
  ...Box.propTypes,
}

DialogHeader.displayName = 'Dialog.Header'
Dialog.displayName = 'Dialog'

export type DialogProps = ComponentProps<typeof Dialog>
export default Object.assign(Dialog, {Header: DialogHeader})
