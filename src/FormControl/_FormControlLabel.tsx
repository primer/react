import React from 'react'
import {SxProp} from '../sx'
import InputLabel from '../_InputLabel'
import {Slot} from './slots'
import {FormControlContext} from './_FormControlContext'

export type Props = {
  /**
   * Whether the label should be visually hidden
   */
  visuallyHidden?: boolean
} & SxProp

const FormControlLabel: React.FC<React.PropsWithChildren<{htmlFor?: string; id?: string} & Props>> = ({
  children,
  htmlFor,
  id,
  visuallyHidden,
  sx
}) => {
  const {disabled, id: formControlId, required} = React.useContext(FormControlContext) ?? {}

  return (
    <Slot name="Label">
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
    </Slot>
  )
}

export default FormControlLabel
