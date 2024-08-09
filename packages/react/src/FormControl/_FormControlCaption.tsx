import React from 'react'
import InputCaption from '../internal/components/InputCaption'
import type {SxProp} from '../sx'
import {useFormControlContext} from './_FormControlContext'

/**
 * The caption with contextual information about the field.
 * @alias FormControl.Caption
 * @primerparentid form_control
 */
const FormControlCaption: React.FC<
  React.PropsWithChildren<
    {
      /** Custom ID to override the ID set by FormControl's React Context */
      id?: string
    } & SxProp
  >
> = ({children, sx, id}) => {
  const {captionId, disabled} = useFormControlContext()
  return (
    <InputCaption id={id || captionId || ''} disabled={disabled} sx={sx}>
      {children}
    </InputCaption>
  )
}

export default FormControlCaption
