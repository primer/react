import React from 'react'
import InputCaption from '../../_InputCaption'
import {InputFieldContext} from './InputField'
import {Slot} from './slots'

const InputFieldCaption: React.FC<React.PropsWithChildren<unknown>> = ({children}) => {
  const {captionId = '', disabled} = React.useContext(InputFieldContext) ?? {}

  return (
    <Slot name="Caption">
      <InputCaption id={captionId} disabled={disabled}>
        {children}
      </InputCaption>
    </Slot>
  )
}

export default InputFieldCaption
