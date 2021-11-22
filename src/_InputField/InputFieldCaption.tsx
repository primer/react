import React from 'react'
import InputCaption from '../InputCaption'
import {InputFieldContext} from './InputField'
import {Slot} from './slots'

const InputFieldCaption: React.FC = ({children}) => (
  <Slot name="Caption">
    {({captionId}: InputFieldContext) => <InputCaption id={captionId}>{children}</InputCaption>}
  </Slot>
)

export default InputFieldCaption
