import {
  TextInput as PrimerTextInput,
  type TextInputProps as PrimerTextInputProps,
  type TextInputActionProps as PrimerTextInputActionProps,
} from '@primer/react'
import {forwardRef} from 'react'
import {Box} from './Box'
import type {SxProp} from '../sx'
import type {ForwardRefExoticComponent, RefAttributes} from 'react'

export type TextInputProps = PrimerTextInputProps & SxProp & {as?: React.ElementType}
export type TextInputActionProps = PrimerTextInputActionProps & SxProp

const StyledTextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  return <Box as={PrimerTextInput} ref={ref} {...props} />
})

const TextInputImpl = forwardRef<HTMLInputElement, TextInputProps>(({as, ...props}, ref) => {
  return <StyledTextInput ref={ref} {...props} {...(as ? {forwardedAs: as} : {})} />
})

const TextInputAction = forwardRef<HTMLButtonElement, TextInputActionProps>((props, ref) => {
  return <Box as={PrimerTextInput.Action} ref={ref} {...props} />
})

type TextInputComposite = ForwardRefExoticComponent<TextInputProps & RefAttributes<HTMLInputElement>> & {
  Action: typeof TextInputAction
}

export const TextInput: TextInputComposite = Object.assign(TextInputImpl, {
  Action: TextInputAction,
})

TextInputAction.displayName = 'TextInputAction'
TextInputImpl.displayName = 'TextInput'
