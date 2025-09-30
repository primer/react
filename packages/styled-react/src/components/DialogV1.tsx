import {Dialog as PrimerDialog} from '@primer/react/deprecated'
import type {
  DialogProps as PrimerDialogProps,
  DialogHeaderProps as PrimerDialogHeaderProps,
} from '@primer/react/deprecated'
import {Box} from './Box'
import type {SxProp} from '../sx'
import {forwardRef} from 'react'

type DialogProps = PrimerDialogProps & SxProp

const DialogImpl = forwardRef<HTMLDivElement, DialogProps>(function Dialog(props, ref) {
  return <Box as={PrimerDialog} ref={ref} {...props} />
})

type DialogHeaderProps = PrimerDialogHeaderProps & SxProp

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(props, ref) {
  return <Box as={PrimerDialog.Header} ref={ref} {...props} />
})

const Dialog = Object.assign(DialogImpl, {
  Header: DialogHeader,
})

export {Dialog}
export type {DialogProps, DialogHeaderProps}
