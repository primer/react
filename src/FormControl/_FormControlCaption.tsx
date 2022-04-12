import React from 'react'
import {SxProp} from '../sx'
import InputCaption from '../_InputCaption'
import {FormControlContext} from './FormControl'
import {Slot} from './slots'

const FormControlCaption: React.FC<{id?: string} & SxProp> = ({children, sx, id}) => (
  <Slot name="Caption">
    {({captionId, disabled}: FormControlContext) => (
      <InputCaption id={id || captionId} disabled={disabled} sx={sx}>
        {children}
      </InputCaption>
    )}
  </Slot>
)

export default FormControlCaption
