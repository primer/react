import React from 'react'
import InputLabel from '../InputLabel'
import {InputFieldContext, Slot} from './InputField'

export interface Props {
  visuallyHidden?: boolean
}

const InputFieldLabel: React.FC<Props> = ({children, visuallyHidden}) => (
  <Slot name="Label">
    {({id, required}: InputFieldContext) => (
      <InputLabel
        id={id}
        visuallyHidden={visuallyHidden}
        required={required}
        title={required ? 'required field' : undefined}
      >
        {children}
      </InputLabel>
    )}
  </Slot>
)

export default InputFieldLabel
