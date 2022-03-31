import React from 'react'
import InputCaption from '../../_InputCaption'
import {InputFieldContext} from './InputField'
import {Slot} from './slots'

const InputFieldCaption: React.FC = ({children}) => (
  <Slot name="Caption">
    {({captionId, disabled}: InputFieldContext) => (
      <InputCaption id={captionId} disabled={disabled}>
        {children}
      </InputCaption>
    )}
  </Slot>
)

export default InputFieldCaption
