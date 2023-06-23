import React from 'react'
import InputCaption from '../../internal/components/InputCaption'
import {InputFieldContext} from './InputField'
import {Slot} from './slots'

const InputFieldCaption: React.FC<React.PropsWithChildren<unknown>> = ({children}) => (
  <Slot name="Caption">
    {({captionId, disabled}: InputFieldContext) => (
      <InputCaption id={captionId} disabled={disabled}>
        {children}
      </InputCaption>
    )}
  </Slot>
)

export default InputFieldCaption
