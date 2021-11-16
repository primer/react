import React from 'react'
import InputLabel from '../InputLabel'
import {InputFieldContext, Slot} from './InputField'

export interface Props {
  /**
   * Whether the label should be visually hidden
   */
  visuallyHidden?: boolean
}

const InputFieldLabel: React.FC<Props> = ({children, visuallyHidden}) => (
  <Slot name="Label">
    {({disabled, id, required}: InputFieldContext) => (
      <InputLabel
        htmlFor={id}
        visuallyHidden={visuallyHidden}
        required={required}
        disabled={disabled}
        title={required ? 'required field' : undefined}
      >
        {children}
      </InputLabel>
    )}
  </Slot>
)

export default InputFieldLabel
