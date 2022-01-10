import React from 'react'
import InputLabel from '../_InputLabel'
import {InputFieldContext} from './InputField'
import {Slot} from './slots'

export interface Props {
  /**
   * Whether the label should be visually hidden
   */
  visuallyHidden?: boolean
}

const InputFieldLabel: React.FC<Props> = ({children, visuallyHidden}) => (
  <Slot name="Label">
    {({disabled, id, required}: InputFieldContext) => (
      <InputLabel htmlFor={id} visuallyHidden={visuallyHidden} required={required} disabled={disabled}>
        {children}
      </InputLabel>
    )}
  </Slot>
)

export default InputFieldLabel
