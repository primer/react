import React from 'react'
import InputLabel, {LabelProps, LegendOrSpanProps} from '../_InputLabel'
import {SxProp} from '../sx'
import {FormControlContext} from './FormControl'

export type Props = {
  /**
   * Whether the label should be visually hidden
   */
  visuallyHidden?: boolean
  id?: string
} & SxProp

const FormControlLabel: React.FC<
  React.PropsWithChildren<{htmlFor?: string} & (LegendOrSpanProps | LabelProps) & Props>
> = ({children, htmlFor, id, visuallyHidden, sx}) => {
  const {disabled, id: formControlId, required} = React.useContext(FormControlContext)
  return (
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
  )
}

export default FormControlLabel
