import {TextInput as PrimerTextInput} from '@primer/react'
import type {ComponentProps} from 'react'
import {forwardRef} from 'react'
import {Box} from './Box'
import type {SxProp} from '../sx'

export type TextInputProps = ComponentProps<typeof PrimerTextInput> & SxProp
export type TextInputActionProps = ComponentProps<typeof PrimerTextInput.Action> & SxProp

const TextInputImpl = (props: TextInputProps) => <PrimerTextInput {...props} />

const TextInputAction = forwardRef<HTMLButtonElement, TextInputActionProps>((props, ref) => {
  return <Box as={PrimerTextInput.Action} ref={ref} {...props} />
})

type TextInputComposite = ((props: TextInputProps) => JSX.Element) & {
  Action: typeof TextInputAction
}

export const TextInput: TextInputComposite = Object.assign(TextInputImpl, {
  Action: TextInputAction,
})

TextInputAction.displayName = 'TextInputAction'
TextInputImpl.displayName = 'TextInput'
