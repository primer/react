import React from 'react'
import InputCaption from '../internal/components/InputCaption'
import {SxProp} from '../sx'
import {FormControlContext} from './FormControl'

const FormControlCaption: React.FC<React.PropsWithChildren<{id?: string} & SxProp>> = ({children, sx, id}) => {
  const {captionId, disabled} = React.useContext(FormControlContext)
  return (
    <InputCaption id={id || captionId || ''} disabled={disabled} sx={sx}>
      {children}
    </InputCaption>
  )
}

export default FormControlCaption
