import React from 'react'
import {SxProp} from '../sx'
import InputCaption from '../_InputCaption'
import {FormControlContext} from './FormControl'
import {Slot} from './slots'

const FormControlCaption: React.FC<SxProp> = ({children, sx}) => (
  <Slot name="Caption">
    {({captionId, disabled}: FormControlContext) => (
      <InputCaption id={captionId} disabled={disabled} sx={sx}>
        {children}
      </InputCaption>
    )}
  </Slot>
)

export default FormControlCaption
