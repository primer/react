import {TextInput as PrimerTextInput, type TextInputActionProps as PrimerTextInputActionProps} from '@primer/react'
import {forwardRef} from 'react'
import {Box} from './Box'
import type {SxProp} from '../sx'

export type TextInputActionProps = PrimerTextInputActionProps & SxProp

const TextInputAction = forwardRef<HTMLButtonElement, TextInputActionProps>((props, ref) => {
  return <Box as={PrimerTextInput.Action} ref={ref} {...props} />
})

export const TextInput: typeof PrimerTextInput & {Action: typeof TextInputAction} = Object.assign(PrimerTextInput, {
  Action: TextInputAction,
})

TextInputAction.displayName = 'TextInputAction'
