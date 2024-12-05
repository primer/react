import React from 'react'
import InputCaption from '../internal/components/InputCaption'
import type {SxProp} from '../sx'
import {useFormControlContext} from './_FormControlContext'

const FormControlCaption: React.FC<React.PropsWithChildren<{id?: string} & SxProp>> = ({children, sx, id}) => {
  const {captionId, disabled} = useFormControlContext()
  return (
    <InputCaption id={id || captionId || ''} disabled={disabled} sx={sx}>
      {children}
    </InputCaption>
  )
}

export default FormControlCaption
