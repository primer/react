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
  // eslint-disable-next-line primer-react/spread-props-first -- `as` must come before spread for styled-components type inference
  return <Box as={PrimerDialog} ref={ref} {...props} />
})

const DialogImpl = forwardRef(({as, ...props}: DialogProps, ref) => (
  <StyledDialog {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
)) as ForwardRefComponent<'div', DialogProps>

type DialogHeaderProps = PrimerDialogHeaderProps & SxProp

const StyledDialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(props, ref) {
  // eslint-disable-next-line primer-react/spread-props-first -- `as` must come before spread for styled-components type inference
  return <Box as={PrimerDialog.Header} ref={ref} {...props} />
})

const DialogHeader = forwardRef(({as, ...props}: DialogHeaderProps, ref) => (
  <StyledDialogHeader {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
)) as ForwardRefComponent<'div', DialogHeaderProps>

const Dialog = Object.assign(DialogImpl, {
  Header: DialogHeader,
})

export {Dialog}
export type {DialogProps, DialogHeaderProps}
