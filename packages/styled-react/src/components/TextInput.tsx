import {
  TextInput as PrimerTextInput,
  type TextInputActionProps as PrimerTextInputActionProps,
  type TextInputProps,
} from '@primer/react'
import {forwardRef} from 'react'
import {Box} from './Box'
import type {SxProp} from '../sx'

export type TextInputActionProps = PrimerTextInputActionProps & SxProp

const TextInputAction = forwardRef<HTMLButtonElement, TextInputActionProps>((props, ref) => {
  return <Box as={PrimerTextInput.Action} ref={ref} {...props} />
})

const TextInput: typeof PrimerTextInput & {Action: typeof TextInputAction} = Object.assign(PrimerTextInput, {
  Action: TextInputAction,
})
TextInput.displayName = 'TextInput'
TextInputAction.displayName = 'TextInput.Action'

export {TextInput, type TextInputProps}
