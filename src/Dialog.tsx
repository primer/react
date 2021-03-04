import React, {forwardRef, useRef} from 'react'
import styled from 'styled-components'
import ButtonClose from './Button/ButtonClose'
import {COMMON, get, LAYOUT, SystemCommonProps, SystemLayoutProps} from './constants'
import Flex from './Flex'
import useDialog from './hooks/useDialog'
import sx, {SxProp} from './sx'
import Text from './Text'
import {ComponentProps} from './utils/types'

const noop = () => null

type StyledDialogBaseProps = {
  narrow?: boolean
  wide?: boolean
} & SystemLayoutProps &
  SystemCommonProps &
  SxProp

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
  background-color: ${get('colors.bg.primary')};
  width: ${props => (props.narrow ? '320px' : props.wide ? '640px' : '440px')};
  outline: none;

  @media screen and (max-width: 750px) {
    width: 100vw;
    margin: 0;
    border-radius: 0;
    height: 100vh;
  }

  ${LAYOUT};
  ${COMMON};
  ${sx};
`

const DialogHeaderBase = styled(Flex)<SxProp>`
  border-radius: ${get('radii.2')} ${get('radii.2')} 0px 0px;
  border-bottom: 1px solid ${get('colors.border.primary')};

  @media screen and (max-width: 750px) {
    border-radius: 0px;
  }

  ${sx};
`
export type DialogHeaderProps = ComponentProps<typeof DialogHeaderBase>

function DialogHeader({theme, children, backgroundColor = 'gray.1', ...rest}: DialogHeaderProps) {
  if (React.Children.toArray(children).every(ch => typeof ch === 'string')) {
    children = (
      <Text theme={theme} color="text.primary" fontSize={1} fontWeight="bold" fontFamily="sans-serif">
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
    z-index: 80;
    display: block;
    cursor: default;
    content: ' ';
    background: transparent;
    z-index: 99;
    background: ${get('colors.fade.black50')};
  }
`

type InternalDialogProps = {
  isOpen?: boolean
  onDismiss?: () => void
  initialFocusRef?: React.RefObject<HTMLDivElement>
  returnFocusRef?: React.RefObject<HTMLDivElement>
  modalRef?: React.ForwardedRef<HTMLElement>
} & ComponentProps<typeof DialogBase>

const Dialog = forwardRef<HTMLElement, InternalDialogProps>(
  (
    {children, onDismiss = noop, isOpen, initialFocusRef, returnFocusRef, ...props},
    forwardedRef: React.ForwardedRef<HTMLElement>
  ) => {
    const backupRef = useRef(null)
    const overlayRef = useRef(null)
    const modalRef = (forwardedRef as React.RefObject<HTMLDivElement>) ?? backupRef
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
      overlayRef
    })
    return isOpen ? (
      <>
        <Overlay ref={overlayRef} />
        <DialogBase tabIndex={-1} ref={modalRef} role="dialog" aria-modal="true" {...props} {...getDialogProps()}>
          <ButtonClose
            ref={closeButtonRef}
            onClick={onCloseClick}
            sx={{position: 'absolute', top: '16px', right: '16px'}}
          />
          {children}
        </DialogBase>
      </>
    ) : null
  }
)

DialogHeader.defaultProps = {
  backgroundColor: 'bg.tertiary'
}

DialogHeader.propTypes = {
  ...Flex.propTypes
}

DialogHeader.displayName = 'Dialog.Header'
Dialog.displayName = 'Dialog'

export type DialogProps = ComponentProps<typeof Dialog>
export default Object.assign(Dialog, {Header: DialogHeader})
