import React from 'react'
import InputCaption from '../_InputCaption'
import {FormControlContext} from './FormControl'
import {Slot} from './slots'

const FormControlCaption: React.FC = ({children}) => (
  <Slot name="Caption">
    {({captionId, disabled}: FormControlContext) => (
      <InputCaption id={captionId} disabled={disabled}>
        {children}
      </InputCaption>
    )}
  </Slot>
)

export default FormControlCaption
