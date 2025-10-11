import {
  TextInput as PrimerTextInput,
  type TextInputProps as PrimerTextInputProps,
  type TextInputActionProps as PrimerTextInputActionProps,
} from '@primer/react'
import {forwardRef} from 'react'
import {sx, type SxProp} from '../sx'
import type {ForwardRefExoticComponent, RefAttributes} from 'react'
import {type ForwardRefComponent} from '../polymorphic'
import styled from 'styled-components'

export type TextInputProps = PrimerTextInputProps & SxProp & {as?: React.ElementType}
export type TextInputActionProps = PrimerTextInputActionProps & SxProp

const StyledTextInput: ForwardRefComponent<'input', TextInputProps> = styled(PrimerTextInput).withConfig({
  shouldForwardProp: prop => (prop as keyof TextInputProps) !== 'sx',
})<TextInputProps>`
  ${sx}
`

const TextInputImpl = forwardRef<HTMLInputElement, TextInputProps>(({as, ...props}, ref) => {
  return <StyledTextInput ref={ref} {...props} {...(as ? {forwardedAs: as} : {})} />
})

const TextInputAction: ForwardRefComponent<'button', TextInputActionProps> = styled(PrimerTextInput.Action).withConfig({
  shouldForwardProp: prop => (prop as keyof TextInputActionProps) !== 'sx',
})<TextInputActionProps>`
  ${sx}
`

type TextInputComposite = ForwardRefExoticComponent<TextInputProps & RefAttributes<HTMLInputElement>> & {
  Action: typeof TextInputAction
}

export const TextInput: TextInputComposite = Object.assign(TextInputImpl, {
  Action: TextInputAction,
})

TextInputAction.displayName = 'TextInputAction'
TextInputImpl.displayName = 'TextInput'
