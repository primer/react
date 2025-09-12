import {Box, TextInput as PrimerTextInput, type TextInputProps as PrimerTextInputProps} from '@primer/react'
import {forwardRef, type PropsWithChildren} from 'react'
import type {SxProp} from '../sx'

type TextInputProps = PropsWithChildren<PrimerTextInputProps> & SxProp

const TextInputImpl: React.ForwardRefExoticComponent<TextInputProps & React.RefAttributes<HTMLInputElement>> =
  forwardRef<HTMLInputElement, TextInputProps>(function TextInput(props, ref) {
    return <Box as={PrimerTextInput as React.ElementType} ref={ref} {...props} />
  })

// Type annotation needed because TextInput uses `@primer/react` internals:
// `TextInputWrapper` component and `FormValidationStatus` type
const TextInput: typeof TextInputImpl & {
  Action: typeof PrimerTextInput.Action
} = Object.assign(TextInputImpl, {
  Action: PrimerTextInput.Action,
})

export {TextInput}
export type {TextInputProps}
