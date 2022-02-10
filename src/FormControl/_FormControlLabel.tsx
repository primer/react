import React from 'react'
import {SxProp} from '../sx'
import InputLabel from '../_InputLabel'
import {FormControlContext} from './FormControl'
import {Slot} from './slots'

export type Props = {
  /**
   * Whether the label should be visually hidden
   */
  visuallyHidden?: boolean
} & SxProp

const FormControlLabel: React.FC<Props> = ({children, visuallyHidden, sx}) => (
  <Slot name="Label">
    {({disabled, id, required}: FormControlContext) => (
      <InputLabel htmlFor={id} visuallyHidden={visuallyHidden} required={required} disabled={disabled} sx={sx}>
        {children}
      </InputLabel>
    )}
  </Slot>
)

export default FormControlLabel
