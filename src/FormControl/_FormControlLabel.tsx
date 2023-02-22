import React from 'react'
import {SxProp} from '../sx'
import InputLabel, {LegendOrSpanProps, LabelProps} from '../_InputLabel'
import {FormControlContext} from './FormControl'
import {Slot} from './slots'

export type Props = {
  /**
   * Whether the label should be visually hidden
   */
  visuallyHidden?: boolean
  id?: string
} & SxProp

const FormControlLabel: React.FC<
  React.PropsWithChildren<{htmlFor?: string} & (LegendOrSpanProps | LabelProps) & Props>
> = ({children, htmlFor, id, visuallyHidden, sx}) => (
  <Slot name="Label">
    {({disabled, id: formControlId, required}: FormControlContext) => (
      <InputLabel
        htmlFor={htmlFor || formControlId}
        id={id}
        visuallyHidden={visuallyHidden}
        required={required}
        disabled={disabled}
        sx={sx}
      >
        {children}
      </InputLabel>
    )}
  </Slot>
)

export default FormControlLabel
