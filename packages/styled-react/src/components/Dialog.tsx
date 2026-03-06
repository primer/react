import {Dialog as PrimerDialog} from '@primer/react'
import type {DialogProps as PrimerDialogProps, SlotMarker} from '@primer/react'
import type {SxProp} from '../sx'
import {sx} from '../sx'
import styled from 'styled-components'
import {forwardRef, type ComponentPropsWithoutRef, type PropsWithChildren} from 'react'

type DialogProps = PropsWithChildren<PrimerDialogProps> & SxProp & {as?: React.ElementType}

const StyledDialog = styled(PrimerDialog).withConfig({
  shouldForwardProp: prop => (prop as keyof DialogProps) !== 'sx',
})<DialogProps>`
  ${sx}
`

const DialogImpl = forwardRef<HTMLDivElement, DialogProps>(function Dialog({as, ...props}, ref) {
  return <StyledDialog ref={ref} {...(as ? {forwardedAs: as} : {})} {...props} />
})

type DialogHeaderProps = ComponentPropsWithoutRef<'div'> & SxProp & {as?: React.ElementType}

const StyledDialogHeader = styled(PrimerDialog.Header).withConfig({
  shouldForwardProp: prop => (prop as keyof DialogHeaderProps) !== 'sx',
})<DialogHeaderProps>`
  ${sx}
`

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader({as, ...props}, ref) {
  return <StyledDialogHeader ref={ref} {...(as ? {forwardedAs: as} : {})} {...props} />
})

type StyledBodyProps = React.ComponentProps<'div'> & SxProp & {as?: React.ElementType}

const StyledDialogBody = styled(PrimerDialog.Body).withConfig({
  shouldForwardProp: prop => (prop as keyof StyledBodyProps) !== 'sx',
})<StyledBodyProps>`
  ${sx}
`

const DialogBody = forwardRef<HTMLDivElement, StyledBodyProps>(function DialogBody({as, ...props}, ref) {
  return <StyledDialogBody ref={ref} {...(as ? {forwardedAs: as} : {})} {...props} />
})

type StyledFooterProps = React.ComponentProps<'div'> & SxProp & {as?: React.ElementType}

const StyledDialogFooter = styled(PrimerDialog.Footer).withConfig({
  shouldForwardProp: prop => (prop as keyof StyledFooterProps) !== 'sx',
})<StyledFooterProps>`
  ${sx}
`

const DialogFooter = forwardRef<HTMLDivElement, StyledFooterProps>(function DialogFooter({as, ...props}, ref) {
  return <StyledDialogFooter ref={ref} {...(as ? {forwardedAs: as} : {})} {...props} />
})

;(DialogHeader as typeof DialogHeader & SlotMarker).__SLOT__ = PrimerDialog.Header.__SLOT__
;(DialogBody as typeof DialogBody & SlotMarker).__SLOT__ = PrimerDialog.Body.__SLOT__
;(DialogFooter as typeof DialogFooter & SlotMarker).__SLOT__ = PrimerDialog.Footer.__SLOT__

const Dialog = Object.assign(DialogImpl, {
  __SLOT__: PrimerDialog['__SLOT__'],
  Buttons: PrimerDialog.Buttons,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
})

export {Dialog}
export type {DialogProps}
