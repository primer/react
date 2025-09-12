import {Dialog as PrimerDialog} from '@primer/react'
import type {DialogProps as PrimerDialogProps, DialogHeaderProps as PrimerDialogHeaderProps} from '@primer/react'
import styled from 'styled-components'
import {sx} from '../sx'
import type {SxProp} from '../sx'
import {forwardRef, type PropsWithChildren} from 'react'

const Wrapper = styled.div<SxProp>`
  ${sx}
`

type DialogProps = PropsWithChildren<PrimerDialogProps> & SxProp

const DialogImpl = forwardRef<HTMLDivElement, DialogProps>(function Dialog(props, ref) {
  return <Wrapper as={PrimerDialog} ref={ref} {...props} />
})

type DialogHeaderProps = PropsWithChildren<PrimerDialogHeaderProps> & SxProp

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(props, ref) {
  // @ts-expect-error - PrimerDialog.Header is not recognized as a valid component type
  return <Wrapper as={PrimerDialog.Header} ref={ref} {...props} />
})

const DialogBody = forwardRef<HTMLDivElement, DialogProps>(function DialogBody(props, ref) {
  // @ts-expect-error - PrimerDialog.Body is not recognized as a valid component type
  return <Wrapper as={PrimerDialog.Body} ref={ref} {...props} />
})

const DialogFooter = forwardRef<HTMLDivElement, DialogProps>(function DialogFooter(props, ref) {
  // @ts-expect-error - PrimerDialog.Footer is not recognized as a valid component type
  return <Wrapper as={PrimerDialog.Footer} ref={ref} {...props} />
})

const Dialog = Object.assign(DialogImpl, {
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
})

export {Dialog}
export type {DialogProps}
