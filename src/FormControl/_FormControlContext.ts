import {createContext} from 'react'
import {FormControlProps} from './FormControl'

export interface FormControlContext extends Pick<FormControlProps, 'disabled' | 'id' | 'required'> {
  captionId?: string
  validationMessageId?: string
}

export const FormControlContext = createContext<FormControlContext | null>(null)
