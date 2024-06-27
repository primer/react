import {TextInput as TextInputImpl} from './TextInput'
import {TextInputAction} from './TextInputInnerAction'
import type {TextInputProps, TextInputNonPassthroughProps} from './TextInput'

TextInputImpl.displayName = 'TextInput'

export const TextInput = Object.assign(TextInputImpl, {
  Action: TextInputAction,
})

export type {TextInputProps, TextInputNonPassthroughProps}
