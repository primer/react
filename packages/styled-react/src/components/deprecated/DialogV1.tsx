import {Dialog as PrimerDialog} from '@primer/react/deprecated'
import type {
  DialogProps as PrimerDialogProps,
  DialogHeaderProps as PrimerDialogHeaderProps,
} from '@primer/react/deprecated'
import {Box} from '../Box'
import type {SxProp} from '../../sx'
import {forwardRef} from 'react'
import type {ForwardRefComponent} from '../../polymorphic'

type DialogProps = PrimerDialogProps & SxProp

const StyledDialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(props, ref) {
  return <Box as={PrimerDialog} ref={ref} {...props} />
})

const DialogImpl = forwardRef(({as, ...props}: DialogProps, ref) => (
  <StyledDialog {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
)) as ForwardRefComponent<'div', DialogProps>

type DialogHeaderProps = PrimerDialogHeaderProps & SxProp

const StyledDialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(props, ref) {
  return <Box as={PrimerDialog.Header} ref={ref} {...props} />
})

const DialogHeader = forwardRef(({as, ...props}: DialogHeaderProps, ref) => (
  <StyledDialogHeader {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
)) as ForwardRefComponent<'div', DialogHeaderProps>

const Dialog = Object.assign(DialogImpl, {
  Header: DialogHeader,
})

// @ts-ignore -- TS doesn't know about the __SLOT__ property
DialogImpl.__SLOT__ = PrimerDialog.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
DialogHeader.__SLOT__ = PrimerDialog.Header.__SLOT__

export {Dialog}
export type {DialogProps, DialogHeaderProps}
