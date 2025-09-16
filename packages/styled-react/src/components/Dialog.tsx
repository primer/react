import {Dialog as PrimerDialog} from '@primer/react'
import type {DialogProps as PrimerDialogProps, DialogHeaderProps as PrimerDialogHeaderProps} from '@primer/react'
import {Box} from './Box'
import type {SxProp} from '../sx'
import {forwardRef, type PropsWithChildren} from 'react'

type DialogProps = PropsWithChildren<PrimerDialogProps> & SxProp

const DialogImpl = forwardRef<HTMLDivElement, DialogProps>(function Dialog(props, ref) {
  // @ts-expect-error - PrimerDialog is not recognized as a valid component type
  return <Box as={PrimerDialog} ref={ref} {...props} />
})

type DialogHeaderProps = PropsWithChildren<PrimerDialogHeaderProps> & SxProp

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(props, ref) {
  // @ts-expect-error - PrimerDialog.Header is not recognized as a valid component type
  return <Box as={PrimerDialog.Header} ref={ref} {...props} />
})

type StyledBodyProps = React.ComponentProps<'div'>

const DialogBody = forwardRef<HTMLDivElement, StyledBodyProps>(function DialogBody(props, ref) {
  // @ts-expect-error - PrimerDialog.Body is not recognized as a valid component type
  return <Box as={PrimerDialog.Body} ref={ref} {...props} />
})

type StyledFooterProps = React.ComponentProps<'div'>

const DialogFooter = forwardRef<HTMLDivElement, StyledFooterProps>(function DialogFooter(props, ref) {
  return <Box as={PrimerDialog.Footer} ref={ref} {...props} />
})

const Dialog = Object.assign(DialogImpl, {
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
})

export {Dialog}
export type {DialogProps}
