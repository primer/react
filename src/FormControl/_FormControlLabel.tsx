import React from 'react'
import InputLabel from '../_InputLabel'
import {FormControlContext} from './FormControl'
import {Slot} from './slots'

export interface Props {
  /**
   * Whether the label should be visually hidden
   */
  visuallyHidden?: boolean
}

const FormControlLabel: React.FC<Props> = ({children, visuallyHidden}) => (
  <Slot name="Label">
    {({disabled, id, required}: FormControlContext) => (
      <InputLabel htmlFor={id} visuallyHidden={visuallyHidden} required={required} disabled={disabled}>
        {children}
      </InputLabel>
    )}
  </Slot>
)

export default FormControlLabel
