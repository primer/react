import React from 'react'
import InputCaption from '../InputCaption'
import {InputFieldContext, Slot} from './InputField'

const InputFieldCaption: React.FC = ({children}) => (
  <Slot name="Caption">
    {({captionId}: InputFieldContext) => <InputCaption id={captionId}>{children}</InputCaption>}
  </Slot>
)

export default InputFieldCaption
